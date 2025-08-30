import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../src/api.js';
import Chart from '../components/Chart.jsx';

export default function Dashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.dailyStats(days)
      .then(res => {
        if (active) {
          setData(res.data);
          setErr('');
        }
      })
      .catch(e => setErr(e.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
    return () => { active = false; };
  }, [days]);

  const summary = useMemo(() => {
    const totalCount = data.reduce((acc, d) => acc + (d.count || 0), 0);
    const totalAmount = data.reduce((acc, d) => acc + (d.totalAmount || 0), 0);
    return { totalCount, totalAmount };
  }, [data]);

  return (
    <div>
      <div className="card">
        <div className="flex">
          <h2>Dashboard</h2>
          <div className="right">
            <select className="select" value={days} onChange={e => setDays(Number(e.target.value))} style={{ minWidth: 140 }}>
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="center" style={{ height: 320 }}>Loading...</div>
        ) : err ? (
          <div style={{ color: 'var(--danger)' }}>{err}</div>
        ) : (
          <>
            <div className="row">
              <div className="col">
                <div className="card">
                  <div className="flex">
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>Total Items</div>
                      <div style={{ fontSize: 28, fontWeight: 700 }}>{summary.totalCount}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card">
                  <div className="flex">
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>Total Amount</div>
                      <div style={{ fontSize: 28, fontWeight: 700 }}>${summary.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Chart data={data} />
          </>
        )}
      </div>
    </div>
  );
}
