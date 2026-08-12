import {labState} from './research-state.js';
import {observatoryMarkup,toolMarkup,planningMarkup,bindObservatory,bindTools,bindPlanning} from './research-stations-a.js';
import {reliabilityMarkup,failureMarkup,longMarkup,bindReliability,bindFailure,bindLong} from './research-stations-b.js';

export function stationMarkup(){if(labState.station==='tools')return toolMarkup();if(labState.station==='planning')return planningMarkup();if(labState.station==='reliability')return reliabilityMarkup();if(labState.station==='failure')return failureMarkup();if(labState.station==='long')return longMarkup();return observatoryMarkup();}

export function bindExperimentEvents(render){document.querySelectorAll('[data-station]').forEach(b=>b.addEventListener('click',()=>{labState.station=b.dataset.station;render();}));if(labState.station==='tools')bindTools(render);else if(labState.station==='planning')bindPlanning(render);else if(labState.station==='reliability')bindReliability(render);else if(labState.station==='failure')bindFailure(render);else if(labState.station==='long')bindLong(render);else bindObservatory(render);}