erDiagram
    User {
        string id PK
        string name
        string email UK
        string password
        Role role
        string phone
        string address
        int followerCounts
        int followingCounts
        int postCounts
        datetime createdAt
        datetime updatedAt
    }

    Teacher {
        string id PK
        string userId FK,UK
        string classRoom
        string studyMaterial
        string[] studySystem
        int courseCounts
        int lessonCounts
        int noteCounts
        int homeworkCounts
        int examCounts
    }

    Student {
        string id PK
        string userId FK,UK
        string educationalStage
        string classRoom
    }

    Center {
        string id PK
        string userId FK,UK
        string governorate
        string[] educationalStage
        string[] studySystem
    }

    ProfileTeacher {
        string id PK
        string userId FK,UK
        string bio
        float star
        string whatsApp
        int sharePrice
        string[] centersWhereHeStudie
        int experienceYear
        string educationalQualification
    }

    ProfileCenter {
        string id PK
        string userId FK,UK
        string bio
        string whatsApp
        string[] contactUsPhone
        string[] contactUsEmail
        string[] studyMaterials
    }

    RefreshToken {
        string id PK
        string userId FK,UK
        string token
    }

    Review {
        string id PK
        int rate
        string ownerReviewId FK
        string userReviewId FK
    }

    Course {
        string id PK
        string teacherId FK
        datetime time
        string studyMaterial
        string classRoom
        int studentCounts
        int lessonCounts
        int noteCounts
        int examCounts
        int homeworkCounts
        datetime createdAt
    }

    Lesson {
        string id PK
        string teacherId FK
        string title
        string description
        string videoUrl
        string courseId FK
        datetime createdAt
    }

    BookedLesson {
        string id PK
        string studentId FK
        string lessonId FK
    }

    Note {
        string id PK
        string teacherId FK
        string lessonId FK
        string courseId FK
        string fileUrl
        datetime createdAt
    }

    Homework {
        string id PK
        string teacherId FK
        string lessonId FK
        string courseId FK
        string fileUrl
        datetime createdAt
    }

    Exam {
        string id PK
        string teacherId FK
        string lessonId FK
        string courseId FK
        string fileUrl
        datetime createdAt
    }

    WeeklySchedule {
        string id PK
        string centerId FK
        string classRoom
    }

    TeacherDay {
        string id PK
        string teacherId FK
        string weeklyScheduleId FK
        string time
        string day
        string studyMaterial
        string centerId FK
    }

    BookedWeekly {
        string id PK
        string studentId FK
        string teacherDayId FK
    }

    Post {
        string id PK
        string userId FK
        Role role
        string title
        string content
        string imageUrl
        int likeCounts
        int commentCounts
        datetime createdAt
    }

    Comment {
        string id PK
        string userId FK
        string postId FK
        string content
        datetime createdAt
    }

    Like {
        string id PK
        string userId FK
        string postId FK
    }

    Follower {
        string id PK
        string followingId FK
        string followerId FK
    }

    %% One-to-One relationships
    User ||--|| Teacher : "has one"
    User ||--|| Student : "has one"
    User ||--|| Center : "has one"
    User ||--|| ProfileTeacher : "has one"
    User ||--|| ProfileCenter : "has one"
    User ||--|| RefreshToken : "has one"

    %% One-to-Many from User
    User ||--o{ Post : "writes"
    User ||--o{ Comment : "writes"
    User ||--o{ Like : "likes"
    User ||--o{ Review : "owns reviews (ownerReviewId)"
    User ||--o{ Review : "receives reviews (userReviewId)"

    %% Self-referential Follower
    User ||--o{ Follower : "following (followingId)"
    User ||--o{ Follower : "followers (followerId)"

    %% Teacher relationships
    Teacher ||--o{ Course : "teaches"
    Teacher ||--o{ Lesson : "creates"
    Teacher ||--o{ Note : "creates"
    Teacher ||--o{ Homework : "assigns"
    Teacher ||--o{ Exam : "creates"
    Teacher ||--o{ TeacherDay : "has"

    %% Course relationships
    Course ||--o{ Lesson : "contains"
    Course ||--o{ Note : "has"
    Course ||--o{ Homework : "has"
    Course ||--o{ Exam : "has"

    %% Lesson relationships
    Lesson ||--o{ Note : "has"
    Lesson ||--o{ Homework : "has"
    Lesson ||--o{ Exam : "has"
    Lesson ||--o{ BookedLesson : "booked by"

    %% Student relationships
    Student ||--o{ BookedLesson : "books"
    Student ||--o{ BookedWeekly : "books"

    %% Center relationships
    Center ||--o{ WeeklySchedule : "has"
    Center ||--o{ TeacherDay : "hosts"

    %% WeeklySchedule relationships
    WeeklySchedule ||--o{ TeacherDay : "contains"

    %% TeacherDay relationships
    TeacherDay ||--o{ BookedWeekly : "booked"

    %% Post relationships
    Post ||--o{ Comment : "has"
    Post ||--o{ Like : "has"