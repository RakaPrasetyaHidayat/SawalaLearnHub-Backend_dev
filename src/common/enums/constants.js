"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceType = exports.SubmissionStatus = exports.TaskStatus = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["USER"] = "USER";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING"] = "PENDING";
    UserStatus["APPROVED"] = "APPROVED";
    UserStatus["REJECTED"] = "REJECTED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
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
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var ResourceType;
(function (ResourceType) {
    ResourceType["ARTICLE"] = "ARTICLE";
    ResourceType["VIDEO"] = "VIDEO";
    ResourceType["DOCUMENT"] = "DOCUMENT";
    ResourceType["LINK"] = "LINK";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
