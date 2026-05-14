type Level = "debug"|"info"|"warn"|"error";
const isProd = process.env.NODE_ENV === "production";
const colors: Record<Level,string> = { debug:"\x1b[90m", info:"\x1b[36m", warn:"\x1b[33m", error:"\x1b[31m" };
const R = "\x1b[0m";
function emit(level: Level, c: unknown, m?: string) {
  const ctx = typeof c==="string" ? {} : (c as Record<string,unknown>)??{};
  const msg = typeof c==="string" ? c : (m??"");
  const entry = { level, time: new Date().toISOString(), msg, ...ctx };
  if (isProd) { console.log(JSON.stringify(entry)); }
  else { const x=Object.keys(ctx).length?` ${JSON.stringify(ctx)}`:""; console.log(`${colors[level]}[${level.toUpperCase()}]${R} ${entry.time} ${msg}${x}`); }
}
export const logger = {
  debug:(c:unknown,m?:string)=>emit("debug",c,m),
  info:(c:unknown,m?:string)=>emit("info",c,m),
  warn:(c:unknown,m?:string)=>emit("warn",c,m),
  error:(c:unknown,m?:string)=>emit("error",c,m),
};
