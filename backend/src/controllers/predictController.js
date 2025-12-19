const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.getPrediction = (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    // Resolve path to script
    // We are in backend/src/controllers
    // We want ../../../Exam_Predictor/Exam_Question_Predictor.py
    const scriptPath = path.resolve(__dirname, '../../../Exam_Predictor/Exam_Question_Predictor.py');

    // Resolve path to python executable in external folder
    const venvPython = 'E:\\Exam_Predictor\\.venv\\Scripts\\python.exe';

    // Use venv python if it exists, otherwise system python
    const pythonCommand = fs.existsSync(venvPython) ? venvPython : 'python';

    console.log(`Running prediction script: ${scriptPath} with query: ${query}`);
    console.log(`Using Python interpreter: ${pythonCommand}`);

    const pythonProcess = spawn(pythonCommand, [scriptPath, query]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python script error output:', errorString);
            // It might be that the script printed the error to stdout as valid JSON (handled in script), 
            // but if code != 0, it's a crash.
            return res.status(500).json({
                message: 'Error processing prediction',
                error: errorString || 'Unknown error occurred in Python script'
            });
        }

        try {
            // script prints JSON
            const results = JSON.parse(dataString);
            res.json({ questions: results });
        } catch (e) {
            console.error('JSON parsing error:', e);
            console.log('Raw output:', dataString);
            // Return raw output if JSON parse fails
            res.json({ questions: ["Error parsing model output."], raw: dataString });
        }
    });
};
