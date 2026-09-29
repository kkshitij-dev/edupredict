import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';
import Evaluation from '../../../lib/models/Evaluation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      studentId, fullName, department, semester, pastGpa, 
      attendance, internalMarks, projectScore, vivaScore, assignments, studyHours 
    } = body;

    // Feature Weighting algorithm
    const predictedScore = Math.min(100, Math.max(0, Number((
      (internalMarks * 0.7847) +
      (projectScore * 0.0870) +
      (attendance * 0.0512) +
      ((pastGpa / 10 * 100) * 0.0259) +
      (vivaScore * 0.0243) +
      (assignments * 0.0203) +
      (Math.min(studyHours * 5, 100) * 0.0066)
    ).toFixed(1))));

    let predictedGrade = 'F (Fail / Critical)';
    if (predictedScore >= 90) predictedGrade = 'A+ (Outstanding)';
    else if (predictedScore >= 80) predictedGrade = 'A (Excellent)';
    else if (predictedScore >= 70) predictedGrade = 'B+ (Very Good)';
    else if (predictedScore >= 50) predictedGrade = 'C (Pass / Average)';

    let riskCategory = 'Low Risk';
    if (predictedScore < 50 || attendance < 75) riskCategory = 'High Risk';
    else if (predictedScore < 70) riskCategory = 'Moderate Risk';

    await connectToDatabase();
    const evaluation = await Evaluation.create({
      studentId, fullName, department, semester, pastGpa,
      attendance, internalMarks, projectScore, vivaScore, assignments, studyHours,
      predictedScore, predictedGrade, riskCategory
    });

    return NextResponse.json({ success: true, data: evaluation, predictedScore, predictedGrade, riskCategory });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const evaluations = await Evaluation.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: evaluations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}