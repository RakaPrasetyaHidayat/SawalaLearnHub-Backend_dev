"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceType = exports.SubmissionStatus = exports.TaskStatus = exports.UserRole = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING"] = "PENDING";
    UserStatus["APPROVED"] = "APPROVED";
    UserStatus["REJECTED"] = "REJECTED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SISWA"] = "SISWA";
    UserRole["MENTOR"] = "MENTOR";
})(UserRole || (exports.UserRole = UserRole = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["DRAFT"] = "DRAFT";
    TaskStatus["PUBLISHED"] = "PUBLISHED";
    TaskStatus["ARCHIVED"] = "ARCHIVED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["SUBMITTED"] = "SUBMITTED";
    SubmissionStatus["OVERDUE"] = "OVERDUE";
    SubmissionStatus["REVISED"] = "REVISED";
    SubmissionStatus["APPROVED"] = "APPROVED";
})(SubmissionStatus || (exports.SubmissionStatus = {}));
var ResourceType;
(function (ResourceType) {
    ResourceType["ARTICLE"] = "ARTICLE";
    ResourceType["VIDEO"] = "VIDEO";
    ResourceType["DOCUMENT"] = "DOCUMENT";
    ResourceType["LINK"] = "LINK";
})(ResourceType || (exports.ResourceType = {}));
