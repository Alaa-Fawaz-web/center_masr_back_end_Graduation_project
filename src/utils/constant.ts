import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

const studyMaterialArray: string[] = [
  'العلوم',
  'الفيزياء',
  'الأحياء',
  'الجبر',
  'الاستاتيكا',
  'التاريخ',
  'التفاضل والتكامل',
  'الديناميكا',
  'الكيمياء',
  'الجغرافيا',
  'الرياضيات',
  'الهندسة الفراغية',
  'الدراسات الاجتماعية',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'الفلسفة والمنطق',
  'التربية الدينية',
  'التربية البدنية',
  'علوم الحاسوب/تكنولوجيا المعلومات',
  'تكنولوجيا المعلومات والاتصالات',
];

const classRoomArray: string[] = [
  'الصف الأول الابتدائي',
  'الصف الثاني الابتدائي',
  'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي',
  'الصف الخامس الابتدائي',
  'الصف السادس الابتدائي',
  'الصف الأولى الإعدادية',
  'الصف الثانية الإعدادية',
  'الصف الثالثة الإعدادية',
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الإعدادي',
];

const weekDays: string[] = [
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
];

const Roles = ['admin', 'teacher', 'student', 'center'];

const [ADMIN, TEACHER, STUDENT, CENTER]: string[] = Roles;

const roleTeacherAndCenter: string[] = [TEACHER, CENTER];

const roleTeacherAndCenterSet: Set<string> = new Set(roleTeacherAndCenter);

const educationalStageArray: string[] = [
  'المرحلة الابتدائية',
  'المرحلة الثانوية',
  'الجامعة',
];
const roleArray: string[] = [STUDENT, TEACHER, CENTER, ADMIN];

const roleSet: Set<string> = new Set(roleArray);
const classRoomSet = new Set(classRoomArray);
const studyMaterialSet = new Set(studyMaterialArray);
const educationalStageSet = new Set(educationalStageArray);
const daySet = new Set(weekDays);
const studySystemSet = new Set(['arabic', 'english']);

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
  studyMaterialArray,
  educationalStageArray,
  roleTeacherAndCenterSet,
};
