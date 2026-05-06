import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Lock, Unlock, Clock, UserPlus, Zap, RefreshCw, Trash, Settings } from "lucide-react";
import "./page.css";

const durations = {
  "3 Hours (3+1)": 4,
  "4 Hours (4+1)": 5,
  "4 Hours (4+2)": 6,
};

const stakes = ["5K", "10K", "25K", "50K", "100K"];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(date) {
  return date
    .toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function getTimeParts(end) {
  const diff = end - new Date();
  const sign = diff < 0 ? "-" : "";
  const abs = Math.abs(diff);
  const h = String(Math.floor(abs / 3600000)).padStart(2, "0");
  const m = String(Math.floor((abs % 3600000) / 60000)).padStart(2, "0");
  return { sign, h, m };
}

function getStatus(end) {
  const diff = (end - new Date()) / 60000;
  if (diff > 60)
    return {
      label: "LOCKED",
      sub: "CANNOT LEAVE YET",
      cls: "locked",
      timeCls: "locked-time",
      icon: <Lock size={15} />,
    };
  if (diff > 0)
    return {
      label: "GRACE PERIOD",
      sub: "CAN LEAVE SOON",
      cls: "grace",
      timeCls: "grace-time",
      icon: <Clock size={15} />,
    };
  return {
    label: "FREE TO LEAVE",
    sub: "CAN LEAVE ANYTIME",
    cls: "free",
    timeCls: "free-time",
    icon: <Unlock size={15} />,
  };
}

export default function App() {
//   const [players, setPlayers] = useState([]);

const [players, setPlayers] = useState(() => {
  try {
    const saved = localStorage.getItem("gor_players");
    if (!saved) return [];
    return JSON.parse(saved).map((p) => ({
      ...p,
      start: new Date(p.start), // re-hydrate the Date string
    }));
  } catch {
    return [];
  }
});
  const [name, setName] = useState("");
  const [stake, setStake] = useState("10K");
  const [duration, setDuration] = useState("4 Hours (4+1)");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
  localStorage.setItem("gor_players", JSON.stringify(players));
}, [players]);

  useEffect(() => {
    const i = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(i);
  }, []);

  const addPlayer = (hours) => {
    if (!name) return;
    const hrs = hours ?? durations[duration];
    setPlayers((p) => [
      ...p,
      { id: Date.now(), name, stake, start: new Date(), hours: hrs },
    ]);
    setName("");
  };


//   const addPlayer = (hours) => {
//   if (!name) return;
//   const hrs = hours ?? durations[duration];
//   const trimmed = name.trim().toLowerCase();

//   setPlayers((prev) => {
//     const existing = prev.find(
//       (p) => p.name.trim().toLowerCase() === trimmed
//     );

//     if (existing) {
//       // Same player — add new stake to buyIns array, keep original start/time
//       return prev.map((p) =>
//         p.id === existing.id
//           ? { ...p, buyIns: [...(p.buyIns ?? [p.stake]), stake] }
//           : p
//       );
//     }

//     // New player
//     return [
//       ...prev,
//       {
//         id: Date.now(),
//         name: name.trim(),
//         stake,
//         buyIns: [stake],
//         start: new Date(),
//         hours: hrs,
//       },
//     ];
//   });

//   setName("");
// };


  const removePlayer = (id) =>
    setPlayers((p) => p.filter((x) => x.id !== id));

  const clearAll = () => setPlayers([]);

  return (
    <div className="frame">
      {/* HEADER */}
      <div className="top-bar">
        {/* Logo */}
        <div className="logo-badge">
          <div className="logo-circle">
            <span className="logo-inner">R</span>
          </div>
          <div className="logo-name">GAME OF RIVER<br />PRIVATE CLUB</div>
        </div>

        {/* Title */}
        <div className="title-block">
          <div className="ornament">♠</div>
          <h1>GAME OF RIVER</h1>
          <div className="sub">— &nbsp; POKER IS ALL ABOUT RIVER &nbsp; —</div>
          <div className="sub2">Call Time Tracker</div>
        </div>

        {/* Clock */}
        <div className="clock">
          <div className="date">
            {now.toLocaleDateString(undefined, {
              weekday: "long",
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).toUpperCase()}
          </div>
          <div className="time">
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
      {players.length === 0 && (
        <div className="empty-row">NO PLAYERS ADDED YET</div>
      )}

      {players.map((p) => {
        const end = new Date(p.start.getTime() + p.hours * 3600000);
        const status = getStatus(end);
        const t = getTimeParts(end);

        return (
          <motion.div
            key={p.id}
            className="row"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Player */}
            <div className="player">
              <div className="avatar">{p.name[0].toUpperCase()}</div>
              <span className="player-name">{p.name.toUpperCase()}</span>
            </div>

            {/* Stake */}
            <div>
              <span className="chip">{p.stake}</span>
            </div>

            {/* Stake — show all buy-ins */}
{/* <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center" }}>
  {(p.buyIns ?? [p.stake]).map((s, i) => (
    <span key={i} className="chip">{s}</span>
  ))}
</div> */}

            {/* Start time */}
            <div>
              {formatTime(p.start)}
              <span>{formatDate(p.start)}</span>
            </div>

            {/* Leave at */}
            <div>
              {formatTime(end)}
              <span>{formatDate(end)}</span>
            </div>

            {/* Time left */}
            <div className="time-col">
              <div className={`big ${status.timeCls}`}>
                {t.sign}{t.h}:{t.m}
              </div>
              <div className="small">HRS &nbsp;&nbsp; MINS</div>
            </div>

            {/* Status */}
            <div className="status">
              <div className={`status-box ${status.cls}`}>
                {status.icon}
                <div>{status.label}</div>
                <span>{status.sub}</span>
              </div>
              <button className="delete-btn" onClick={() => removePlayer(p.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        );
      })}

      {/* CONTROLS */}
      <div className="controls-area">
        {/* Add player */}
        <div className="add-player-panel">
          <div className="panel-title">
            <UserPlus size={13} /> ADD PLAYER
          </div>
          <div className="add-player-row">
            <input
              placeholder="Player Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            />
            <select value={stake} onChange={(e) => setStake(e.target.value)}>
              {stakes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              {Object.keys(durations).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <button className="add-btn" onClick={() => addPlayer()}>
              ADD PLAYER
            </button>
          </div>
        </div>

        {/* Quick presets */}
        <div className="presets-panel">
          <div className="panel-title">
            <Zap size={13} /> QUICK PRESETS
          </div>
          <div className="preset-btns">
            <button className="preset-btn" onClick={() => addPlayer(4)}>
              3 HOURS + 1 HOUR
            </button>
            <button className="preset-btn" onClick={() => addPlayer(5)}>
              4 HOURS + 1 HOUR
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="actions-panel">
          <button className="action-btn" onClick={() => setNow(new Date())}>
            <RefreshCw size={15} /> REFRESH
          </button>
          <button className="action-btn" onClick={clearAll}>
            <Trash size={15} /> CLEAR ALL
          </button>
          <button className="action-btn">
            <Settings size={15} /> SETTINGS
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">FAIR GAME. RESPECT THE GAME.</div>
    </div>
  );
}