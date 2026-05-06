import { useState, useEffect } from "react";
import { Users, Clock, TrendingUp } from "lucide-react";
import "./tablesPage.css";

const TABLE_CONFIGS = [
  { id: 1, label: "TABLE 1", stakes: "10K / 20K", seats: 9 },
  { id: 2, label: "TABLE 2", stakes: "5K / 10K",  seats: 9 },
  { id: 3, label: "TABLE 3", stakes: "25K / 50K", seats: 6 },
  { id: 4, label: "TABLE 4", stakes: "10K / 20K", seats: 9 },
];

// Dummy seed players so cards aren't empty on first render
const SEED = [
  { table: 1, players: ["RAHUL", "AMIT", "KARAN", "VIKRAM", "SURESH"] },
  { table: 2, players: ["DEEPAK", "MOHAN", "SANJAY"] },
  { table: 3, players: ["RAVI", "ARJUN", "PRIYA", "NEHA"] },
  { table: 4, players: ["ANIL", "SUMAN", "KUNAL", "TARUN", "MANISH", "ROHIT"] },
];

function buildSeatedPlayers() {
  const map = {};
  SEED.forEach(({ table, players }) => {
    map[table] = players.map((name, i) => ({
      id: i,
      name,
      since: new Date(Date.now() - Math.random() * 4 * 3600000),
    }));
  });
  return map;
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function elapsed(since) {
  const diff = Date.now() - since;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TablesPage() {
  const [now, setNow] = useState(new Date());
  const [seated] = useState(buildSeatedPlayers);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="tp-frame">
      {/* ── HEADER ── */}
      <div className="tp-top-bar">
        <div className="tp-logo-badge">
          <div className="tp-logo-circle">
            <span className="tp-logo-inner">R</span>
          </div>
          <div className="tp-logo-name">GAME OF RIVER<br />PRIVATE CLUB</div>
        </div>

        <div className="tp-title-block">
          <div className="tp-ornament">♠</div>
          <h1>GAME OF RIVER</h1>
          <div className="tp-sub">— &nbsp; POKER IS ALL ABOUT RIVER &nbsp; —</div>
          <div className="tp-sub2">Table Overview</div>
        </div>

        <div className="tp-clock">
          <div className="tp-date">
            {now.toLocaleDateString(undefined, {
              weekday: "long", day: "2-digit", month: "short", year: "numeric",
            }).toUpperCase()}
          </div>
          <div className="tp-time">
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="tp-divider" />

      {/* ── CARDS GRID ── */}
      <div className="tp-grid">
        {TABLE_CONFIGS.map((tbl) => {
          const players = seated[tbl.id] ?? [];
          const occupancy = players.length;
          const pct = Math.round((occupancy / tbl.seats) * 100);
          const isFull = occupancy >= tbl.seats;

          return (
            <div key={tbl.id} className={`tp-card ${isFull ? "tp-card--full" : ""}`}>
              {/* Card header */}
              <div className="tp-card-header">
                <div className="tp-card-num">
                  <span className="tp-spade">♠</span>
                  {tbl.label}
                </div>
                <div className={`tp-card-badge ${isFull ? "badge--full" : "badge--open"}`}>
                  {isFull ? "FULL" : "OPEN"}
                </div>
              </div>

              {/* Stakes row */}
              <div className="tp-card-stakes">
                <TrendingUp size={13} />
                STAKES &nbsp;<strong>{tbl.stakes}</strong>
              </div>

              {/* Divider */}
              <div className="tp-inner-divider" />

              {/* Seat bar */}
              <div className="tp-seat-info">
                <div className="tp-seat-label">
                  <Users size={13} />
                  <span>{occupancy} / {tbl.seats} SEATS</span>
                </div>
                <div className="tp-seat-bar">
                  <div
                    className={`tp-seat-fill ${isFull ? "fill--full" : pct > 66 ? "fill--high" : "fill--low"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Players list */}
              <div className="tp-players-list">
                {players.map((p) => (
                  <div key={p.id} className="tp-player-row">
                    <div className="tp-p-left">
                      <div className="tp-avatar">{p.name[0]}</div>
                      <span className="tp-pname">{p.name}</span>
                    </div>
                    <div className="tp-p-right">
                      <Clock size={11} />
                      <span className="tp-since">{formatTime(p.since)}</span>
                      <span className="tp-elapsed">({elapsed(p.since)})</span>
                    </div>
                  </div>
                ))}

                {/* Empty seat slots */}
                {Array.from({ length: tbl.seats - occupancy }).map((_, i) => (
                  <div key={`empty-${i}`} className="tp-player-row tp-empty-seat">
                    <div className="tp-p-left">
                      <div className="tp-avatar tp-avatar--empty">—</div>
                      <span className="tp-pname tp-pname--empty">OPEN SEAT</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div className="tp-card-footer">
                <span>{tbl.seats - occupancy} seat{tbl.seats - occupancy !== 1 ? "s" : ""} available</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FOOTER ── */}
      <div className="tp-footer">FAIR GAME. RESPECT THE GAME.</div>
    </div>
  );
}