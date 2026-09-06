 FOR USERPROBLEM.JS:

  This controller is responsible for validating a new coding problem before saving it to your database.
  It ensures that the admin/creator hasn't provided a broken reference solution.

  The Verification Loop
  You are running a nested loop here to thoroughly test the code: 
  Outer Loop (for...of referenceSolution): A problem might have reference solutions in multiple languages (e.g., one in C++, one in Java). This loop goes through each one.
  Inner Loop (for...of visibleTestCases): For a specific language's solution, it iterates through every visible test case to verify it passes.

  Execution & Comparison
  Inside that inner loop, the actual validation happens:
  Running the Code: await executeCode(...) pauses the loop, sends the current solution and the current test case input to JDoodle, and waits for the output.
  The .trim() Method: This is a crucial detail. When code runs (especially in languages like C++ or Java), it often outputs trailing newlines (\n) or spaces. testCase.output from your database might just be "3", but JDoodle might return "3\n". Using .trim() on both sides ensures you don't reject a perfectly valid solution due to invisible formatting characters.
  The Condition: if (actualOutput !== expectedOutput) checks for a mismatch.
  The Block: If they don't match, you use return res.status(400).send(...). The return keyword is critical here—it immediately stops the entire controller execution. No further test cases are run, and the database save is aborted.

  Success & Database Saving
  If the code survives the loops without triggering the 400 error, it means every reference solution passed every test case.
  The commented-out Problem.create(...) block is where you will eventually insert the verified data into MongoDB.
  Finally, a 201 Created status is sent back to the frontend.