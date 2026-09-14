
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

// day6

const updateProblem = async (req,res) => {

     const {id} = req.params;
     const {title, desription, difficulty, tags, 
        visibleTestCases, hiddenTestCases, startCode,
         referenceSolution,problemCreator} = req.body;
    

     try{

          if(!id){
             return res.status(400).send("Missing ID Field");
          }       
          
          const DsaProblem = await Problem.findById(id);
          if(!DsaProblem){
              res.status(404).send("Problem not found");
          }

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
        
        
        const newProblem = await Problem.findByIdAndUpdate(id, {...req.body}, {runValidators:true, new:true});
        
        res.status(200).send(newProblem);

     }
     catch{
       res.send(404).send("Error: "+err);
     }
 }

const deleteProblem = async (req,res) =>{
    
    const {id} = req.params;

    try{
       
        if(!id){
            return res.status(400).send("ID is missing");
        }

        const deletedProblem = await Problem.findByIdAndDelete(id);

        if(!deletedProblem){
            return res.status(404).send("Problem not found");
        }
        res.status(200).send("Problem deleted successfully");
    }
    catch(err){
        res.status(500).send("Error: "+err);
    }
}

const getProblemById = async (req,res) => {

    const {id} = req.params;

    try{

        if(!id){
            return res.status(404).send("Problem is missing");
        }

        const getProblem = await Problem.findById(id);

        if(!getProblem){
            return res.status(404).send("Problem is missing");
        }

        res.status(200).send(getProblem);
    }
   catch(err0){

   }
}

const getAllProblem = async (req,res) => {
    try{

        const getProblem = await Problem.find({});

        if(getProblem.length == 0){
            return res.status(404).send("Problem is missing");
        }

        res.status(200).send(getProblem);
    }
    catch(err){ 
        res.status(500).send("Error: "+err);
    }
}


module.exports = { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem };