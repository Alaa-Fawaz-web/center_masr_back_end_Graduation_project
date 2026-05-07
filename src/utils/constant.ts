import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const studyMaterialArray: string[] = [
  'العلوم',
  'الفيزياء',
  'الاحياء',
  'الجبر',
  'الاستاتيكا',
  'التاريخ',
  'التفاضل والتكامل',
  'الديناميكا',
  'الكيمياء',
  'الجغرافيا',
  'الرياضيات',
  'اللغة الاجنبية الثانية',
  'الهندسة الفراغية',
  'الدراسات الاجتماعية',
  'اللغة العربية',
  'اللغة الانجليزية',
  'الفلسفة والمنطق',
  'التربية الدينية',
  'التربية البدنية',
  'علوم الحاسوب/تكنولوجيا المعلومات',
  'تكنولوجيا المعلومات والاتصالات',
  'علم النفس',
];

const classRoomArray: string[] = [
  'الصف الأول الابتدائي',
  'الصف الثاني الابتدائي',
  'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي',
  'الصف الخامس الابتدائي',
  'الصف السادس الابتدائي',
  'الصف الأولى الإعدادي',
  'الصف الثاني الإعدادي',
  'الصف الثالث الإعدادي',
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الثانوي',
];

const weekDays: string[] = [
  'السبت',
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الاربعاء',
  'الخميس',
  'الجمعة',
];
const weekDaysSet = new Set(weekDays);

const Roles = ['admin', 'teacher', 'student', 'center'];

const [ADMIN, TEACHER, STUDENT, CENTER]: string[] = Roles;

const roleTeacherAndCenter: string[] = [TEACHER, CENTER];

const roleTeacherAndCenterSet: Set<string> = new Set(roleTeacherAndCenter);

const educationalStageArray: string[] = [
  'المرحلة الأبتدائية',
  'المرحلة الأعدادية',
  'المرحلة الثانوية',
];
const roleArray: string[] = [STUDENT, TEACHER, CENTER, ADMIN];

const roleSet: Set<string> = new Set(roleArray);
const classRoomSet = new Set(classRoomArray);
const studyMaterialSet = new Set(studyMaterialArray);
const educationalStageSet = new Set(educationalStageArray);
const daySet = new Set(weekDays);
const studySystemSet = new Set(['عربي', 'انجليزي']);

const [BadRequest, Unauthorized, Forbidden, NotFound] = [
  'BadRequest',
  'Unauthorized',
  'Forbidden',
  'NotFound',
];

const ErrorException = {
  BadRequest: BadRequestException,
  Unauthorized: UnauthorizedException,
  Forbidden: ForbiddenException,
  NotFound: NotFoundException,
};

export {
  ADMIN,
  Roles,
  daySet,
  CENTER,
  roleSet,
  TEACHER,
  classRoomSet,
  studySystemSet,
  educationalStageSet,
  studyMaterialSet,
  STUDENT,
  roleArray,
  roleTeacherAndCenter,
  weekDays,
  BadRequest,
  Unauthorized,
  ErrorException,
  Forbidden,
  NotFound,
  classRoomArray,
  weekDaysSet,
  studyMaterialArray,
  educationalStageArray,
  roleTeacherAndCenterSet,
};
