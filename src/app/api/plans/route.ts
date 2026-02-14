import { NextRequest, NextResponse } from 'next/server';

// 内存存储（重启后数据会清空，适合快速测试）
let plans: any[] = [];

// GET /api/plans - 获取所有计划
export async function GET() {
  try {
    return NextResponse.json(plans);
  } catch (error) {
    console.error('获取计划失败:', error);
    return NextResponse.json(
      { error: '获取计划失败' },
      { status: 500 }
    );
  }
}

// POST /api/plans - 创建新计划
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, city, startDate, endDate, contact, wantPlay, note } = body;

    // 基本验证
    if (!name || !city || !startDate || !endDate) {
      return NextResponse.json(
        { error: '请填写必填字段' },
        { status: 400 }
      );
    }

    // 验证日期
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: '结束日期不能早于开始日期' },
        { status: 400 }
      );
    }

    // 创建新计划
    const newPlan = {
      id: Date.now().toString(), // 使用时间戳作为 ID
      name,
      city,
      start_date: startDate,
      end_date: endDate,
      contact: contact || null,
      want_play: wantPlay !== undefined ? wantPlay : true,
      note: note || null,
      created_at: new Date().toISOString(),
    };

    plans.push(newPlan);

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error('创建计划失败:', error);
    return NextResponse.json(
      { error: '创建计划失败' },
      { status: 500 }
    );
  }
}
