import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface LearningPlan {
    id: bigint;
    completedTasks: Array<string>;
    owner: Principal;
    plan: Array<WeekPlan>;
}
export interface InterviewFeedback {
    communication: bigint;
    suggestions: string;
    overallScore: bigint;
    technicalKnowledge: bigint;
}
export interface Task {
    name: string;
    description: string;
    resourceLink?: string;
}
export interface QuizQuestion {
    answerOptions: Array<string>;
    questionText: string;
    correctAnswerIndex: bigint;
    category: string;
}
export interface Quiz {
    id: bigint;
    attempts: bigint;
    score: bigint;
    questions: Array<QuizQuestion>;
}
export interface WeekPlan {
    tasks: Array<Task>;
    weekNumber: bigint;
}
export interface Resume {
    id: string;
    name: string;
    bytes: ExternalBlob;
    uploadedBy: Principal;
}
export interface CareerGoal {
    targetRole: string;
    relevantSkills: Array<string>;
}
export interface UserProfile {
    name: string;
    email?: string;
    targetRole?: string;
}
export interface LearningProgress {
    completedTasks: bigint;
    averageInterviewScore: bigint;
    averageQuizScore: bigint;
    quizzesTaken: bigint;
    interviewsCompleted: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createLearningPlan(plan: Array<WeekPlan>): Promise<void>;
    getAllResumes(): Promise<Array<Resume>>;
    getCallerLearningPlan(): Promise<LearningPlan | null>;
    getCallerResumes(): Promise<Array<Resume>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCareerGoal(user: Principal): Promise<CareerGoal | null>;
    getFirstIncompleteTask(): Promise<Task>;
    getInterviewFeedback(user: Principal): Promise<InterviewFeedback | null>;
    getQuizResults(user: Principal): Promise<Quiz | null>;
    getResumeByName(name: string): Promise<Resume>;
    getTasks(): Promise<{
        incomplete: Array<Task>;
        completed: Array<string>;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProgress(user: Principal): Promise<LearningProgress | null>;
    isCallerAdmin(): Promise<boolean>;
    isResumeImported(resumeId: string): Promise<boolean>;
    markResumeAsImported(resumeId: string): Promise<void>;
    markTaskComplete(taskId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveInterviewFeedback(feedback: InterviewFeedback): Promise<void>;
    saveLearningProgress(progress: LearningProgress): Promise<void>;
    saveQuizResults(quiz: Quiz): Promise<void>;
    setCareerGoal(goal: CareerGoal): Promise<void>;
    updateTaskCompletionStatus(completedTaskIds: Array<string>): Promise<void>;
    uploadResume(name: string, file: ExternalBlob): Promise<void>;
}
