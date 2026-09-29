import mongoose, { Schema, model, models } from 'mongoose';

const EvaluationSchema = new Schema({
  studentId: { type: String, required: true },
  fullName: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  pastGpa: { type: Number, required: true },
  attendance: { type: Number, required: true },
  internalMarks: { type: Number, required: true },
  projectScore: { type: Number, required: true },
  vivaScore: { type: Number, required: true },
  assignments: { type: Number, required: true },
  studyHours: { type: Number, required: true },
  predictedScore: { type: Number, required: true },
  predictedGrade: { type: String, required: true },
  riskCategory: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default models.Evaluation || model('Evaluation', EvaluationSchema);