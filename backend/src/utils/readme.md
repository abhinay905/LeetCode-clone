 FOR VALIDATOR.JS:
  
 const IsAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k));
 Object.keys(data) checks every key of req.body to ensure it contains all mandatory fields


 FOR PROBLEMUTILITY.JS:

 this acts as a bridge between JDoodle and backend API. It handles formatting the data so JDoodle understands it.

The Mapper: getLanguageConfig(lang)

  JDoodle doesn't take "c++" or "java" as inputs. It requires a specific language identifier and a versionIndex to know exactly which compiler version to use.
  What it does: It takes a plain text language string (like "C++") from your frontend.
  How it works: It uses toLowerCase() to standardize the input, then looks it up in languageMap.
  The Output: It returns an object with JDoodle's specific requirements (e.g., { language: "cpp", versionIndex: "5" }).

The Executor: executeCode(script, lang, stdin)

   This function that actually sends the code over the internet to be executed.

   Configuration: It first calls getLanguageConfig to get the correct compiler details. If the language isn't in your map, it throws an error immediately to prevent a bad API call.
   The Payload: It uses axios.post to send a JSON object to JDoodle. Notice how it securely pulls clientId and clientSecret from process.env—this ensures your API keys aren't hardcoded into your source code.
   The Execution: It sends the code (script) and any input the code needs (stdin).
   The Return: If JDoodle successfully runs the code, it returns response.data back to your controller. This object typically contains the standard output (output), memory used, and CPU time.



