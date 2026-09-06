
// day4
const { executeCode } = require('../utils/problemUtility');
// Assuming you have your Mongoose model imported here:
const Problem = require('../models/problem'); 

const createProblem = async (req, res) => {
    const { 
        title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases, startCode,
        referenceSolution, problemCreator
    } = req.body;
    
    try {
        // 1. Verify the Reference Solution(s)
        for (const { language, completeCode } of referenceSolution) {
            
            // Note: Assuming visibleTestCases looks like: [{ input: "1 2", output: "3" }]
            // Combine both arrays so the admin solution is tested against all cases
            const allTestCases = [...visibleTestCases, ...hiddenTestCases];

            for (const testCase of allTestCases) {
                
                // Run JDoodle API
                const result = await executeCode(completeCode, language, testCase.input);

                // Check if JDoodle failed completely before trying to trim()
                if (!result || typeof result.output === 'undefined') {
                    return res.status(500).send("JDoodle execution failed to return an output.");
                }

                // Platforms always trim whitespace/newlines before comparing outputs!
                const actualOutput = result.output.trim();
                const expectedOutput = testCase.output.trim();

                // If the reference solution fails its own test case, reject the creation
                if (actualOutput !== expectedOutput) {
                    return res.status(400).send(`Reference solution failed! Expected: ${expectedOutput}, Got: ${actualOutput}`);
                }
            }
        }

        // 2. If the code reaches here, the reference solution is perfect!
        // Now we actually save it to the database.
        
        
        const newProblem = await Problem.create({
            title, description, difficulty, tags,
            visibleTestCases, hiddenTestCases, startCode,
            referenceSolution, problemCreator
        }); 
        

        res.status(201).send("Problem created and verified successfully!");

    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating problem: " + err.message);
    }
};

module.exports = { createProblem };