// Test-only adapter for dependency unrelated to the five patched routes.
export function escapeHtml(s:string):string { return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"); }
