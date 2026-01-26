import { doubleCsrf } from "csrf-csrf";
const csrf = doubleCsrf({ getSecret: () => "secret" });
console.log("Keys:", Object.keys(csrf));
