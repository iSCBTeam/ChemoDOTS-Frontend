// Launch the script Search_Function
const {sendError, sendMessage} = require ("./message");
const {PythonShell} = require('python-shell')
async function Callscript_Func(req, res) {

    let options= {
        pythonOptions: ['-u'], // get print results in real-time
        args: [req.body.smiles]// An argument which can be accessed in the script using sys.argv[1]
    };
    PythonShell.run('./Backend/Python/Search_Function.py', options,(err, output) => {
        return sendMessage(res,output);
     });


}
module.exports=Callscript_Func;