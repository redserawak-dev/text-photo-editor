/* FRAME font ZIP reader. No dependency, network request, or filesystem extraction.
 * ZIP methods 0/8 only; encrypted, split and ZIP64 archives are rejected.
 * Decompression runs in a disposable worker. DEFLATE is wrapped in a gzip
 * envelope using the ZIP CRC/size so browsers with gzip support can read it.
 * Source: PKZIP central-directory layout; Compression Streams Web API.
 */
(() => {
  'use strict';
  const MAX_ARCHIVE = 25 * 1024 * 1024;
  function zipWorker() {
    'use strict';
    const MAX_FONT = 5 * 1024 * 1024, MAX_TOTAL = 30 * 1024 * 1024;
    const fail = message => { throw new Error(message); };
    function directory(buffer) {
      const bytes = new Uint8Array(buffer), view = new DataView(buffer), length = bytes.length;
      const u16 = n => view.getUint16(n,true), u32 = n => view.getUint32(n,true);
      if (length < 22) fail('File ZIP tidak lengkap atau rusak.');
      let end = -1;
      for (let i = length - 22; i >= Math.max(0, length - 65557); i--) {
        if (u32(i) === 0x06054b50 && i + 22 + u16(i + 20) === length) { end = i; break; }
      }
      if (end < 0) fail('Format ZIP tidak dikenali. Gunakan ZIP biasa, bukan RAR atau 7z.');
      if (u16(end+4) || u16(end+6) || u16(end+8) !== u16(end+10)) fail('ZIP multipart belum didukung.');
      const count = u16(end+10), size = u32(end+12), offset = u32(end+16);
      if (count === 65535 || size === 0xffffffff || offset === 0xffffffff) fail('ZIP64 belum didukung. Gunakan ZIP yang lebih kecil.');
      if (count > 3000 || offset + size > end) fail('Struktur ZIP terlalu besar atau tidak valid.');
      const decoder = new TextDecoder('utf-8');
      const entries = [], skipped = []; let ignored = 0, cursor = offset;
      for (let index = 0; index < count; index++) {
        if (cursor + 46 > offset + size || u32(cursor) !== 0x02014b50) fail('Daftar isi ZIP rusak.');
        const flags=u16(cursor+8), method=u16(cursor+10), crc=u32(cursor+16), compressedSize=u32(cursor+20), originalSize=u32(cursor+24);
        const nameLen=u16(cursor+28), extraLen=u16(cursor+30), commentLen=u16(cursor+32), disk=u16(cursor+34), attrs=u32(cursor+38), localOffset=u32(cursor+42);
        const next=cursor+46+nameLen+extraLen+commentLen;
        if (next > offset + size) fail('Daftar isi ZIP terpotong.');
        const path=decoder.decode(bytes.subarray(cursor+46,cursor+46+nameLen)).replace(/\\/g,'/');
        const name=path.split('/').pop(); cursor=next;
        if (!/\.(ttf|otf|woff2?)$/i.test(name || '') || path.startsWith('__MACOSX/') || path.split('/').some(p=>p.startsWith('.')) || !name || name.startsWith('._')) { ignored++; continue; }
        let reason='';
        if (path.length > 500 || path.includes('\0') || path.startsWith('/') || /^[A-Za-z]:/.test(path) || path.split('/').includes('..')) reason='Nama file tidak aman';
        else if (((attrs>>>16)&0xf000)===0xa000) reason='Tautan simbolik bukan font';
        else if (disk || localOffset===0xffffffff || originalSize===0xffffffff || compressedSize===0xffffffff) reason='ZIP64 / multipart';
        else if (flags & 0x41) reason='File terenkripsi';
        else if (![0,8].includes(method)) reason='Metode kompresi belum didukung';
        else if (!originalSize || originalSize>MAX_FONT) reason='Font kosong atau lebih dari 5 MB';
        else if (localOffset+30>offset || compressedSize>length) reason='Posisi file tidak valid';
        if (reason) { skipped.push({name,reason}); continue; }
        if(entries.length>=100) {skipped.push({name,reason:'Batas 100 pilihan font per ZIP'});continue;}
        entries.push({index,path,name,flags,method,crc,compressedSize,size:originalSize,offset:localOffset,centralOffset:offset});
      }
      return {entries,ignored,skipped};
    }
    const table=new Uint32Array(256);
    for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;table[i]=c>>>0;}
    function crc32(bytes){let c=0xffffffff;for(let i=0;i<bytes.length;i++)c=table[(c^bytes[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
    async function unpack(buffer,entry){
      const bytes=new Uint8Array(buffer),view=new DataView(buffer),o=entry.offset;
      if(view.getUint32(o,true)!==0x04034b50)fail('Header file rusak.');
      const flags=view.getUint16(o+6,true),method=view.getUint16(o+8,true),nl=view.getUint16(o+26,true),el=view.getUint16(o+28,true);
      if((flags&0x41)||method!==entry.method)fail('Header lokal tidak sesuai daftar ZIP.');
      const start=o+30+nl+el;
      if(start+entry.compressedSize>entry.centralOffset)fail('Data font terpotong.');
      const compressed=bytes.subarray(start,start+entry.compressedSize);
      let result;
      if(method===0){
        if(compressed.length!==entry.size)fail('Ukuran font dalam ZIP tidak cocok.');
        result=compressed.slice();
      }else{
        if(typeof DecompressionStream==='undefined')fail('Browser ini belum bisa membuka ZIP. Perbarui browser atau impor TTF/OTF langsung.');
        const header=new Uint8Array([31,139,8,0,0,0,0,0,0,255]),footer=new Uint8Array(8),fd=new DataView(footer.buffer);
        fd.setUint32(0,entry.crc,true);fd.setUint32(4,entry.size,true);
        const stream=new Blob([header,compressed,footer]).stream().pipeThrough(new DecompressionStream('gzip'));
        const reader=stream.getReader();result=new Uint8Array(entry.size);let written=0;
        try{
          while(true){const {value,done}=await reader.read();if(done)break;if(written+value.length>entry.size||written+value.length>MAX_FONT){await reader.cancel();fail('Ukuran hasil ekstraksi melewati batas aman.');}result.set(value,written);written+=value.length;}
        }finally{reader.releaseLock();}
        if(written!==entry.size)fail('Ukuran hasil ekstraksi tidak sesuai.');
      }
      if(crc32(result)!==entry.crc)fail('Checksum tidak cocok; file rusak.');
      return result;
    }
    self.onmessage=async({data})=>{
      try{
        const scan=directory(data.buffer);
        if(data.action==='scan'){self.postMessage({ok:true,...scan});return;}
        const chosen=new Set(data.selected||[]),entries=scan.entries.filter(e=>chosen.has(e.index));
        if(entries.length>30)fail('Pilih maksimal 30 font.');
        if(entries.reduce((n,e)=>n+e.size,0)>MAX_TOTAL)fail('Total font pilihan maksimal 30 MB. Pilih lebih sedikit.');
        const files=[],errors=[];
        for(const entry of entries){try{files.push({name:entry.name,path:entry.path,bytes:await unpack(data.buffer,entry)});}catch(e){errors.push({name:entry.name,reason:e.message||'Font gagal diekstrak'});}}
        self.postMessage({ok:true,files,errors},files.map(f=>f.bytes.buffer));
      }catch(error){self.postMessage({ok:false,error:error.message||'ZIP tidak dapat dibuka.'});}
    };
  }
  async function run(file,action,selected=[]){
    if(!file||file.size>MAX_ARCHIVE)throw new Error('ZIP maksimal 25 MB. Pilih paket font yang lebih kecil.');
    const buffer=await file.arrayBuffer();
    const url=URL.createObjectURL(new Blob(['('+zipWorker.toString()+')();'],{type:'text/javascript'}));
    return new Promise((resolve,reject)=>{
      let worker,timer;
      const cleanup=()=>{clearTimeout(timer);worker?.terminate();URL.revokeObjectURL(url);};
      try{
        worker=new Worker(url);
        timer=setTimeout(()=>{cleanup();reject(new Error('Membuka ZIP terlalu lama. Coba paket yang lebih kecil.'));},20000);
        worker.onmessage=({data})=>{cleanup();data.ok?resolve(data):reject(new Error(data.error));};
        worker.onerror=()=>{cleanup();reject(new Error('Browser membatasi pembaca ZIP. Buka lewat browser terbaru atau impor file font langsung.'));};
        worker.postMessage({buffer,action,selected},[buffer]);
      }catch(error){cleanup();reject(new Error('Pembaca ZIP tidak tersedia di browser ini. Impor TTF/OTF langsung.'));}
    });
  }
  window.FrameFontZip={scan:file=>run(file,'scan'),extract:(file,selected)=>run(file,'extract',selected),maxArchive:MAX_ARCHIVE};
})();
