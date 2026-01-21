export const sanitizeHTML = (html) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove script tags, on* attributes, etc.
  const scripts = temp.getElementsByTagName('script');
  for (let i = scripts.length - 1; i >= 0; i--) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }

  const allElements = temp.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    const attributes = el.attributes;
    for (let j = attributes.length - 1; j >= 0; j--) {
      const attrName = attributes[j].name;
      if (attrName.startsWith('on')) {
        el.removeAttribute(attrName);
      }
    }
  }

  return temp.innerHTML;
};
