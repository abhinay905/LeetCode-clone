// // day4

// const axios = require('axios');

// const getLanguageById = (lang) =>{

//     const language = {
//         "c++":54,
//         "java":62,
//         "javascript":63
//     }

//     return language[lang.toLowerCase()];
// }

// const submitBatch = async (submissions) =>{

// }


// module.exports = {
//     getLanguageById,submitBatch
// }

// day4
const axios = require('axios');

const getLanguageConfig = (lang) => {
    const languageMap = {
        "c++": { language: "cpp", versionIndex: "5" },         // C++ 17
        "java": { language: "java", versionIndex: "4" },        // Java 17
        "javascript": { language: "nodejs", versionIndex: "4" } // Node.js 17
    };

    return languageMap[lang.toLowerCase()];
};

const executeCode = async (script, lang, stdin = "") => {
    const config = getLanguageConfig(lang);
    
    if (!config) {
        throw new Error("Unsupported language: " + lang);
    }

    try {
        const response = await axios.post('https://api.jdoodle.com/v1/execute', {
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            script: script,
            stdin: stdin,
            language: config.language,
            versionIndex: config.versionIndex
        });

        return response.data; 

    } catch (error) {
        console.error("JDoodle API Error:", error.response ? error.response.data : error.message);
        throw new Error("Failed to execute code on JDoodle");
    }
};

module.exports = {
    executeCode
};