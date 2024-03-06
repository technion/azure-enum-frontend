// Vite will force you to prepend the trustedTypes function with window. .. still unsure why
// Below is the official tinyfill. Ignore typing since modern browsers will use the proper typed API anyway
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if(typeof window.trustedTypes == 'undefined') console.log("adding tinyfill");// window.trustedTypes={createPolicy:(_n: any, rules: any) => rules} as any;

const parseXMLPolicy = window.trustedTypes?.createPolicy("myEscapePolicy", {
  // This function ultimately just provides an escape policy. There is no "escaping" that can be done on this data without making it invalid XML
  // Our safety is down to: This policy is only called from one quite audited piece of code
  // There is a precedent for this here: https://github.com/cure53/DOMPurify/blob/fcb9dbd9a935d91e1a087b5ee721da1c6b008790/src/purify.js#L58
  createHTML: (string: string) => { return string; },
});

export const parseNodes = (data: string) => { 
  // Safety: parseFromString hardcodes the XML type, which avoids all risks I've found
  // We then read nodes with textContent, which strips all tags
  if (parseXMLPolicy == undefined ) return JSON.stringify({}); // This can't happen due to the "tinyfill"
  const trustedString = parseXMLPolicy.createHTML(data);
  
  const d = new DOMParser();
  const r = d.parseFromString(trustedString as unknown as string, "application/xml");
  if (r.querySelector("parseerror")) {
    throw new Error("Invalid XML received from Endpoint");
  }
  const domainlist = r.querySelectorAll("Domain");
  // Policies can't return an array, so I guess we'll join and resplit.
  return JSON.stringify([...domainlist].map((e) => e.textContent));
  // Calls the Trusted Type policy to parse XML and returns a JSON array
 
  }