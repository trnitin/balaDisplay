import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Lock, Unlock, Clock } from "lucide-react";
import "./app.css";

const durations = {
  "3+1": 4,
  "4+1": 5,
  "4+2": 6
};

const stakes = ["5K", "10K", "25K", "50K", "100K"];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getTimeLeftParts(end) {
  const diff = end - new Date();
  const sign = diff < 0 ? "-" : "";
  const abs = Math.abs(diff);

  const h = Math.floor(abs / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);

  return {
    sign,
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0")
  };
}

function getStatus(end) {
  const diff = (end - new Date()) / 60000;

  if (diff > 60)
    return {
      label: "LOCKED",
      cls: "locked",
      sub: "CANNOT LEAVE YET",
      icon: <Lock />
    };

  if (diff > 0)
    return {
      label: "GRACE PERIOD",
      cls: "grace",
      sub: "CAN LEAVE SOON",
      icon: <Clock />
    };

  return {
    label: "FREE TO LEAVE",
    cls: "free",
    sub: "CAN LEAVE ANYTIME",
    icon: <Unlock />
  };
}

export default function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [stake, setStake] = useState("10K");
  const [duration, setDuration] = useState("4+1");
  const [now, setNow] = useState(new Date());

  const addPlayer = () => {
    if (!name) return;

    setPlayers([
      ...players,
      {
        id: Date.now(),
        name,
        stake,
        start: new Date(),
        hours: durations[duration]
      }
    ]);

    setName("");
  };

  const removePlayer = (id) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((p) => [...p]);
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="frame">
      <div className="app">
        {/* HEADER */}
        <div className="header">
          <h1>GAME OF RIVER</h1>
          <p>POKER IS ALL ABOUT RIVER</p>
          <span>Call Time Tracker</span>

          {/* CLOCK */}
          <div className="clock">
            <div>
              {now.toLocaleDateString(undefined, {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </div>
            <div className="time">
              {now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="table-header">
          <div>PLAYER</div>
          <div>TABLE</div>
          <div>START TIME</div>
          <div>LEAVE AT</div>
          <div>TIME LEFT</div>
          <div>STATUS</div>
        </div>

        {/* ROWS */}
        {players.map((p) => {
          const end = new Date(p.start.getTime() + p.hours * 3600000);
          const status = getStatus(end);
          const time = getTimeLeftParts(end);

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="row"
            >
              {/* PLAYER */}
              <div className="player">
                <div className="avatar">
                  {p.name[0].toUpperCase()}
                </div>
                {p.name}
              </div>

              {/* TABLE */}
              <div className="chip">{p.stake}</div>

              {/* START */}
              <div>
                {formatTime(p.start)}
                <br />
                <small>{p.start.toDateString()}</small>
              </div>

              {/* END */}
              <div>
                {formatTime(end)}
                <br />
                <small>{end.toDateString()}</small>
              </div>

              {/* TIME */}
              <div className="time">
                {time.sign}
                {time.h}:{time.m}
                <small>HRS&nbsp;&nbsp;MINS</small>
              </div>

              {/* STATUS */}
              <div className="status">
                <div className={`status-box ${status.cls}`}>
                  {status.icon}
                  <div>{status.label}</div>
                  <small>{status.sub}</small>
                </div>

                <Trash2
                  style={{ cursor: "pointer" }}
                  onClick={() => removePlayer(p.id)}
                />
              </div>
            </motion.div>
          );
        })}

        {/* CONTROLS */}
        <div className="controls">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Player Name"
          />

          <select value={stake} onChange={(e) => setStake(e.target.value)}>
            {stakes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            {Object.keys(durations).map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <button onClick={addPlayer}>ADD PLAYER</button>
        </div>
      </div>
    </div>
  );
}




// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Trash2, Lock, Unlock, Clock } from "lucide-react";
// import "./app.css";

// const durations = {
//   "3+1": 4,
//   "4+1": 5,
//   "4+2": 6
// };

// const stakes = ["5K", "10K", "25K", "50K", "100K"];

// function formatTime(date) {
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// function formatDate(date) {
//   return date.toLocaleDateString(undefined, {
//     day: "2-digit",
//     month: "short",
//     year: "numeric"
//   });
// }

// function getTimeParts(end) {
//   const diff = end - new Date();
//   const sign = diff < 0 ? "-" : "";
//   const abs = Math.abs(diff);

//   const h = String(Math.floor(abs / 3600000)).padStart(2, "0");
//   const m = String(Math.floor((abs % 3600000) / 60000)).padStart(2, "0");

//   return { sign, h, m };
// }

// function getStatus(end) {
//   const diff = (end - new Date()) / 60000;

//   if (diff > 60)
//     return {
//       label: "LOCKED",
//       sub: "CANNOT LEAVE YET",
//       cls: "locked",
//       icon: <Lock />
//     };

//   if (diff > 0)
//     return {
//       label: "GRACE PERIOD",
//       sub: "CAN LEAVE SOON",
//       cls: "grace",
//       icon: <Clock />
//     };

//   return {
//     label: "FREE TO LEAVE",
//     sub: "CAN LEAVE ANYTIME",
//     cls: "free",
//     icon: <Unlock />
//   };
// }

// export default function App() {
//   const [players, setPlayers] = useState([]);
//   const [name, setName] = useState("");
//   const [stake, setStake] = useState("10K");
//   const [duration, setDuration] = useState("4+1");
//   const [now, setNow] = useState(new Date());

//   useEffect(() => {
//     const i = setInterval(() => {
//       setPlayers((p) => [...p]);
//       setNow(new Date());
//     }, 1000);
//     return () => clearInterval(i);
//   }, []);

//   const addPlayer = () => {
//     if (!name) return;

//     setPlayers([
//       ...players,
//       {
//         id: Date.now(),
//         name,
//         stake,
//         start: new Date(),
//         hours: durations[duration]
//       }
//     ]);

//     setName("");
//   };

//   const removePlayer = (id) =>
//     setPlayers(players.filter((p) => p.id !== id));

//   return (
//     <div className="frame">
//       {/* HEADER */}
//       <div className="top-bar">
//         <div className="logo">♠ R</div>

//         <div className="title-block">
//           <h1>GAME OF RIVER</h1>
//           <div className="sub">POKER IS ALL ABOUT RIVER</div>
//           <div className="sub2">Call Time Tracker</div>
//         </div>

//         <div className="clock">
//           <div className="date">
//             {now.toLocaleDateString(undefined, {
//               weekday: "long",
//               day: "2-digit",
//               month: "short",
//               year: "numeric"
//             })}
//           </div>
//           <div className="time">
//             {now.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit"
//             })}
//           </div>
//         </div>
//       </div>

//       {/* TABLE HEADER */}
//       <div className="table-header">
//         <div>PLAYER</div>
//         <div>TABLE</div>
//         <div>START TIME</div>
//         <div>LEAVE AT</div>
//         <div>TIME LEFT</div>
//         <div>STATUS</div>
//       </div>

//       {/* ROWS */}
//       {players.map((p) => {
//         const end = new Date(p.start.getTime() + p.hours * 3600000);
//         const status = getStatus(end);
//         const t = getTimeParts(end);

//         return (
//           <motion.div
//             key={p.id}
//             className="row"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             <div className="player">
//               <div className="avatar">{p.name[0]}</div>
//               {p.name}
//             </div>

//             <div className="chip">{p.stake}</div>

//             <div>
//               {formatTime(p.start)}
//               <span>{formatDate(p.start)}</span>
//             </div>

//             <div>
//               {formatTime(end)}
//               <span>{formatDate(end)}</span>
//             </div>

//             <div className="time-col">
//               <div className="big">
//                 {t.sign}
//                 {t.h}:{t.m}
//               </div>
//               <div className="small">HRS &nbsp; MINS</div>
//             </div>

//             <div className="status">
//               <div className={`status-box ${status.cls}`}>
//                 {status.icon}
//                 <div>{status.label}</div>
//                 <span>{status.sub}</span>
//               </div>
//               <Trash2 onClick={() => removePlayer(p.id)} />
//             </div>
//           </motion.div>
//         );
//       })}

//       {/* CONTROLS */}
//       <div className="controls">
//         <input
//           placeholder="Player Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <select value={stake} onChange={(e) => setStake(e.target.value)}>
//           {stakes.map((s) => (
//             <option key={s}>{s}</option>
//           ))}
//         </select>

//         <select
//           value={duration}
//           onChange={(e) => setDuration(e.target.value)}
//         >
//           {Object.keys(durations).map((d) => (
//             <option key={d}>{d}</option>
//           ))}
//         </select>

//         <button onClick={addPlayer}>ADD PLAYER</button>
//       </div>
//     </div>
//   );
// }