function s(f,e,i="string",n=[]){return!f||typeof f!="object"||Object.keys(f).forEach(c=>{typeof f[c]=="object"?s(f[c],e,i,n):typeof f[c]===i&&!n.includes(c)&&(f[c]=e(f[c]))}),f}export{s as a};
