import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  // Core modules
  let actors = Set.empty<Text>();
  // Authentication and role-based access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // File storage
  include MixinStorage();

  // Core types
  public type UserProfile = {
    name : Text;
    email : ?Text;
    targetRole : ?Text;
  };

  public type Resume = {
    id : Text;
    name : Text;
    bytes : Storage.ExternalBlob;
    uploadedBy : Principal;
  };

  public type LearningPlan = {
    id : Nat;
    owner : Principal;
    plan : [WeekPlan];
    completedTasks : [Text];
  };

  public type WeekPlan = {
    weekNumber : Nat;
    tasks : [Task];
  };

  public type Task = {
    name : Text;
    description : Text;
    resourceLink : ?Text;
  };

  public type QuizQuestion = {
    questionText : Text;
    answerOptions : [Text];
    correctAnswerIndex : Nat;
    category : Text;
  };

  public type Quiz = {
    id : Nat;
    questions : [QuizQuestion];
    score : Nat;
    attempts : Nat;
  };

  public type InterviewFeedback = {
    overallScore : Nat;
    communication : Nat;
    technicalKnowledge : Nat;
    suggestions : Text;
  };

  public type LearningProgress = {
    completedTasks : Nat;
    quizzesTaken : Nat;
    averageQuizScore : Nat;
    interviewsCompleted : Nat;
    averageInterviewScore : Nat;
  };

  public type CareerGoal = {
    targetRole : Text;
    relevantSkills : [Text];
  };

  public type ImportedResume = {
    id : Text;
    name : Text;
    imported : Bool;
  };

  // Storage maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let resumes = Map.empty<Text, Resume>();
  let learningPlans = Map.empty<Principal, LearningPlan>();
  let quizzes = Map.empty<Principal, Quiz>();
  let interviewFeedbacks = Map.empty<Principal, InterviewFeedback>();
  let learningProgress = Map.empty<Principal, LearningProgress>();
  let careerGoals = Map.empty<Principal, CareerGoal>();
  let importedResumes = Map.empty<Principal, ImportedResume>();

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Resume Management
  public query ({ caller }) func getAllResumes() : async [Resume] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all resumes");
    };
    resumes.values().toArray();
  };

  public query ({ caller }) func getResumeByName(name : Text) : async Resume {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resumes");
    };

    switch (resumes.get(name)) {
      case (null) { Runtime.trap("Resume not found") };
      case (?resume) {
        // Users can only view their own resumes unless admin
        if (resume.uploadedBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own resume");
        };
        resume;
      };
    };
  };

  public shared ({ caller }) func uploadResume(name : Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload resumes");
    };

    let resumeId = name;
    let resume : Resume = {
      id = resumeId;
      name;
      bytes = file;
      uploadedBy = caller;
    };
    resumes.add(resumeId, resume);
  };

  public query ({ caller }) func getCallerResumes() : async [Resume] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view resumes");
    };

    let callerResumes = resumes.values().toArray().filter(
      func(resume) { resume.uploadedBy == caller }
    );
    callerResumes;
  };

  // Imported Resume Handling
  public shared ({ caller }) func markResumeAsImported(resumeId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark resumes as imported");
    };

    let importedResume : ImportedResume = {
      id = resumeId;
      name = resumeId;
      imported = true;
    };
    importedResumes.add(caller, importedResume);
  };

  public query ({ caller }) func isResumeImported(resumeId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check imported resumes");
    };

    let importedResume = importedResumes.get(caller);
    switch (importedResume) {
      case (?res) { res.imported };
      case (null) { false };
    };
  };

  // Learning Plans
  public shared ({ caller }) func createLearningPlan(plan : [WeekPlan]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create learning plans");
    };

    let learningPlanId = learningPlans.size();
    let newLearningPlan : LearningPlan = {
      id = learningPlanId;
      owner = caller;
      plan;
      completedTasks = [];
    };
    learningPlans.add(caller, newLearningPlan);
  };

  public shared ({ caller }) func updateTaskCompletionStatus(completedTaskIds : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update task completion");
    };

    let currentPlan = switch (learningPlans.get(caller)) {
      case (null) { Runtime.trap("Learning plan not found") };
      case (?plan) { plan };
    };

    let updatedPlan = {
      id = currentPlan.id;
      owner = caller;
      plan = currentPlan.plan;
      completedTasks = completedTaskIds;
    };
    learningPlans.add(caller, updatedPlan);
  };

  public query ({ caller }) func getCallerLearningPlan() : async ?LearningPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view learning plans");
    };
    learningPlans.get(caller);
  };

  public query ({ caller }) func getTasks() : async { completed : [Text]; incomplete : [Task] } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    let learningPlan = switch (learningPlans.get(caller)) {
      case (null) { Runtime.trap("Learning plan not found") };
      case (?plan) { plan };
    };

    let allTasks = learningPlan.plan.values().flatMap(func(week) { week.tasks.values() }).toArray();

    let completedTasks = learningPlan.completedTasks;
    let completedTaskSet = Set.fromArray(completedTasks);

    let incompleteTasks = allTasks.filter(
      func(task) { not completedTaskSet.contains(task.name) }
    );

    { completed = completedTasks; incomplete = incompleteTasks };
  };

  public query ({ caller }) func getFirstIncompleteTask() : async Task {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view tasks");
    };

    let learningPlan = switch (learningPlans.get(caller)) {
      case (null) { Runtime.trap("Learning plan not found") };
      case (?plan) { plan };
    };

    let allTasks = learningPlan.plan.values().flatMap(func(week) { week.tasks.values() }).toArray();
    let completedTasks = learningPlan.completedTasks;
    let completedTaskSet = Set.fromArray(completedTasks);

    let incompleteTasks = allTasks.filter(
      func(task) { not completedTaskSet.contains(task.name) }
    );

    if (incompleteTasks.isEmpty()) {
      Runtime.trap("No incomplete tasks found");
    } else {
      incompleteTasks[0];
    };
  };

  public shared ({ caller }) func markTaskComplete(taskId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark tasks complete");
    };

    let learningPlan = switch (learningPlans.get(caller)) {
      case (null) { Runtime.trap("Learning plan not found") };
      case (?plan) { plan };
    };

    let updatedCompletedTasks = learningPlan.completedTasks.concat([taskId]);
    let updatedPlan = {
      id = learningPlan.id;
      owner = learningPlan.owner;
      plan = learningPlan.plan;
      completedTasks = updatedCompletedTasks;
    };

    learningPlans.add(caller, updatedPlan);
  };

  // Interview Feedback
  public shared ({ caller }) func saveInterviewFeedback(feedback : InterviewFeedback) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save interview feedback");
    };

    interviewFeedbacks.add(caller, feedback);
  };

  public query ({ caller }) func getInterviewFeedback(user : Principal) : async ?InterviewFeedback {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view interview feedback");
    };

    // Users can only view their own feedback unless admin
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own interview feedback");
    };

    interviewFeedbacks.get(user);
  };

  // Quizzes
  public shared ({ caller }) func saveQuizResults(quiz : Quiz) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save quiz results");
    };

    quizzes.add(caller, quiz);
  };

  public query ({ caller }) func getQuizResults(user : Principal) : async ?Quiz {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view quiz results");
    };

    // Users can only view their own results unless admin
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own quiz results");
    };

    quizzes.get(user);
  };

  // Learning Progress
  public shared ({ caller }) func saveLearningProgress(progress : LearningProgress) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save learning progress");
    };

    learningProgress.add(caller, progress);
  };

  public query ({ caller }) func getUserProgress(user : Principal) : async ?LearningProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view learning progress");
    };

    // Users can only view their own progress unless admin
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own learning progress");
    };

    learningProgress.get(user);
  };

  // Career Goals
  public shared ({ caller }) func setCareerGoal(goal : CareerGoal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set career goals");
    };

    careerGoals.add(caller, goal);
  };

  public query ({ caller }) func getCareerGoal(user : Principal) : async ?CareerGoal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view career goals");
    };

    // Users can only view their own goals unless admin
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own career goal");
    };

    careerGoals.get(user);
  };
};
