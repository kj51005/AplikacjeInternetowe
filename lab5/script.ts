// script.ts
const styles: { [key: string]: string } = {
    style1: 'css/style1.css',
    style2: 'css/style2.css',
    style3: 'css/style3.css', // Dodany nowy styl
  };
  
  let currentStyle = 'style2';
  
  function applyStyle(style: string) {
    const styleLink = document.getElementById('currentStyle') as HTMLLinkElement;
    styleLink.href = styles[style];
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    applyStyle(currentStyle);
  
    
    const linkStyle1 = document.getElementById('linkStyle1');
    const linkStyle2 = document.getElementById('linkStyle2');
    const linkStyle3 = document.getElementById('linkStyle3'); 
  
    linkStyle1?.addEventListener('click', () => {
      currentStyle = 'style1';
      applyStyle(currentStyle);
    });
  
    linkStyle2?.addEventListener('click', () => {
      currentStyle = 'style2';
      applyStyle(currentStyle);
    });
  
    linkStyle3?.addEventListener('click', () => {
      currentStyle = 'style3';
      applyStyle(currentStyle);
    });
  });
  
  // Pozostała część kodu TypeScript
  const msg: string = "Hello!";
  alert(msg);
  