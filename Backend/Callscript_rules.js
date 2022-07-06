// Launch the script rules_dico
const {sendError, sendMessage} = require ("./message");
const {PythonShell} = require('python-shell')
async function Callscript_rules(req, res) {

    let options= {
        pythonOptions: ['-u'], // get print results in real-time
        args: [req.body.funcname]// An argument which can be accessed in the script using sys.argv[1]
    };
    PythonShell.run('./Backend/Python/rules_dico.py', options,(err, output) => {
        return sendMessage(res,output);
     });


}
module.exports=Callscript_rules;