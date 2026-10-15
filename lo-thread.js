'use strict';
/* Runs inside the ZetaOffice worker (listed in Module.uno_scripts, after zeta.js).
   Messages from lo.html: {cmd:'open',name,bytes} and {cmd:'save'}. Replies: ready, opened, saved, error. */
Module.zetajs.then(function(zetajs){
 const css=zetajs.uno.com.sun.star,desktop=css.frame.Desktop.create(zetajs.getUnoComponentContext()),port=zetajs.mainPort,fsys=self.FS||Module.FS;
 let model=null,path='',name='document';
 port.onmessage=e=>{const m=e.data||{};
  try{
   if(m.cmd==='open'){name=m.name||'document';path='/tmp/'+name.replace(/[^\w.\-]+/g,'_');fsys.writeFile(path,new Uint8Array(m.bytes));
    model=desktop.loadComponentFromURL('file://'+path,'_default',0,[]);port.postMessage({cmd:'opened',name})}
   else if(m.cmd==='save'){if(!model)throw new Error('No document is open yet');
    const st=model.store?model:zetajs.fromAny(model.queryInterface(zetajs.type.interface(css.frame.XStorable)));st.store();
    const b=fsys.readFile(path),out=new Uint8Array(b.length);out.set(b);port.postMessage({cmd:'saved',name,bytes:out.buffer},[out.buffer])}
  }catch(err){let x=err;try{x=zetajs.catchUnoException(err)}catch(_){}port.postMessage({cmd:'error',msg:String((x&&(x.Message||x.message))||x)})}};
 port.postMessage({cmd:'ready'});
});
