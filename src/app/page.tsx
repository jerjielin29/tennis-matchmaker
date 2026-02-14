'use client';

import { useState, useEffect } from 'react';

interface TennisPlan {
  id: string;
  name: string;
  city: string;
  start_date: string;
  end_date: string;
  contact: string | null;
  want_play: boolean;
  note: string | null;
  created_at: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    startDate: '',
    endDate: '',
    contact: '',
    wantPlay: true,
    note: ''
  });
  const [plans, setPlans] = useState<TennisPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 获取所有计划
  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('获取计划失败:', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          larkUserId: null,
          larkUnionId: null,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          city: '',
          startDate: '',
          endDate: '',
          contact: '',
          wantPlay: true,
          note: ''
        });
        await fetchPlans();
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        alert('提交失败，请重试');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 判断是否匹配
  const isMatch = (plan: TennisPlan) => {
    if (!formData.startDate || !formData.endDate) return false;
    const start = new Date(plan.start_date);
    const end = new Date(plan.end_date);
    const formStart = new Date(formData.startDate);
    const formEnd = new Date(formData.endDate);
    return start <= formEnd && end >= formStart;
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #f0fdf4)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            🎾 春节网球约球平台
          </h1>
          <p style={{ color: '#6b7280' }}>
            填写你的春节行程，找到同一时间地点的球友！
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* 左侧：表单 */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              填写你的行程
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                  姓名 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入你的姓名"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                  城市 *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="如：北京、上海、深圳"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    开始日期 *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    结束日期 *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                  联系方式
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="微信号、手机号等"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontWeight: '500' }}>想要约网球</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.wantPlay}
                    onChange={(e) => setFormData({ ...formData, wantPlay: e.target.checked })}
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  是
                </label>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                  备注
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="想约球的话，可以写上你偏好的时间段、场地等"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {submitSuccess && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  border: '1px solid #86efac',
                  color: '#166534',
                  padding: '0.75rem',
                  borderRadius: '0.375rem'
                }}>
                  ✓ 提交成功！
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? '提交中...' : '提交行程'}
              </button>
            </form>
          </div>

          {/* 右侧：匹配结果 */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                已发布行程 ({plans.length})
              </h2>
              <p style={{ color: '#6b7280' }}>
                找到同一时间地点的球友
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
              {plans.length === 0 ? (
                <div style={{
                  background: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  暂无数据，快来发布第一个行程吧！
                </div>
              ) : (
                plans.map((plan) => (
                  <div key={plan.id} style={{
                    background: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    padding: '1.5rem',
                    transition: 'box-shadow 0.2s'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '0.75rem'
                    }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                          {plan.name}
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{
                            backgroundColor: '#f3f4f6',
                            color: '#1f2937',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem'
                          }}>
                            {plan.city}
                          </span>
                          {plan.want_play && (
                            <span style={{
                              backgroundColor: '#22c55e',
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem'
                            }}>
                              🎾 想约球
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {formatDate(plan.created_at)} 发布
                      </span>
                    </div>

                    <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📅</span>
                        <span>
                          {formatDate(plan.start_date)} 至 {formatDate(plan.end_date)}
                        </span>
                      </div>
                    </div>

                    {plan.contact && (
                      <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>📱</span>
                          <span>{plan.contact}</span>
                        </div>
                      </div>
                    )}

                    {plan.note && (
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#4b5563',
                        marginBottom: '0.75rem',
                        backgroundColor: '#f9fafb',
                        padding: '0.5rem',
                        borderRadius: '0.25rem'
                      }}>
                        {plan.note}
                      </p>
                    )}

                    {isMatch(plan) && (
                      <div style={{
                        backgroundColor: '#dbeafe',
                        border: '1px solid #93c5fd',
                        color: '#1e40af',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                      }}>
                        ✨ 时间匹配！可以约球哦
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
