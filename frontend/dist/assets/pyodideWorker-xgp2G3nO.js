(function(){"use strict";importScripts("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");async function d(){self.pyodide=await loadPyodide(),await self.pyodide.loadPackage("numpy");const s=await(await fetch("/bayesian_model.py")).text();self.pyodide.runPython(s),self.pyodide.runPython(`
    model = BayesianBeliefModel()
  `),console.log("Pyodide and model initialized")}let l=d();self.onmessage=async a=>{await l;const{id:s,type:t,payload:o}=a.data;try{let e;switch(t){case"GET_STATE":e=self.pyodide.runPython(`
          import json
          state = model.get_state()
          # Convert to JSON string to avoid proxy issues with complex objects
          json.dumps(state)
        `),e=JSON.parse(e);break;case"ADD_EXPERIENCE":self.pyodide.globals.set("value",o.value),self.pyodide.globals.set("sigma",o.sigma),e=self.pyodide.runPython(`
          exp = model.add_experience(value, sigma)
          json.dumps(exp)
        `),e=JSON.parse(e);break;case"MEDITATE":self.pyodide.globals.set("level",o.meditation_level),e=self.pyodide.runPython(`
          model.meditate_on_latest(level)
          json.dumps({"status": "success"})
        `),e=JSON.parse(e);break;case"SET_BRAHMA_VIHARAS":self.pyodide.globals.set("level",o.level),e=self.pyodide.runPython(`
          model.set_brahma_viharas_level(level)
          json.dumps({"status": "success"})
        `),e=JSON.parse(e);break;case"RESET":self.pyodide.runPython(`
          model = BayesianBeliefModel()
        `),e={status:"success"};break;default:throw new Error(`Unknown message type: ${t}`)}self.postMessage({id:s,result:e})}catch(e){self.postMessage({id:s,error:e.message})}}})();
