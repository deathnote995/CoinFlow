import { createLogger, format, transports } from "winston";
import path from 'path'
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
const onlyDebug=format(log=>{
    return log.level==='debug'?log:false
})
const onlyError=format(log=>{
    return log.level==='error'?log:false
})
const infoAndAbove=format(log=>{
    // return log.level==='info'||'warn'||'error'?log:false
    return ['info','debug','error'].includes(log.level)?log:false
})

const logger=createLogger({
    level:'debug', //sets log level to lowest   
    format:format.combine(
        format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        format.errors({stack:true}),
        format.json()
    ),
    transports:[
        new transports.File({
            filename:path.join(__dirname,'../../logs/info.log'),
            format:format.combine(infoAndAbove(),format.json())
        }),
        new transports.File({
            filename:path.join(__dirname,'../../logs/error.log'),
            // level:'error',
            format:format.combine(onlyError(),format.json())
        }),
        new transports.File({
            filename:path.join(__dirname,'../../logs/debug.log'),
            // level:'debug',
            format:format.combine(onlyDebug(),format.json())
        })
    ],
})

console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV!=='production'){
    logger.add(new transports.Console({
        format:format.combine(
            format.colorize(),
            format.simple()
        )
    }))
}

export default logger