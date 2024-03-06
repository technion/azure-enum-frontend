// Vite will force you to prepend the trustedTypes function with window. .. still unsure why
// Below is the official tinyfill. Ignore typing since modern browsers will use the proper typed API anyway
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if(typeof window.trustedTypes == 'undefined') console.log("adding tinyfill");// window.trustedTypes={createPolicy:(_n: any, rules: any) => rules} as any;

const parseXMLPolicy = window.trustedTypes?.createPolicy("myEscapePolicy", {
    // Safety: parseFromString hardcodes the XML type, which avoids all risks I've found
    // We then read nodes with textContent, which strips all tags
  createHTML: (string: string) => {
    const d = new DOMParser();
    const r = d.parseFromString(string, "application/xml");
    if (r.querySelector("parseerror")) {
      throw new Error("Invalid XML received from Endpoint");
    }
    const domainlist = r.querySelectorAll("Domain");
    // Policies can't return an array, so I guess we'll join and resplit.
    return JSON.stringify([...domainlist].map((e) => e.textContent));
  },
});

export const parseNodes = (data: string) => { 

  // Calls the Trusted Type policy to parse XML and returns a JSON array
  if (parseXMLPolicy == undefined ) return JSON.stringify({}); // This can't happen due to the "tinyfill"
  return parseXMLPolicy.createHTML(data).toString();
  
  }