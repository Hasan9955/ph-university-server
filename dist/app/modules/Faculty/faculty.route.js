"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const faculty_controller_1 = require("./faculty.controller");
const faculty_validation_1 = require("./faculty.validation");
const validator_1 = __importDefault(require("../../Middlewares/validator"));
const authValidator_1 = __importDefault(require("../../Middlewares/authValidator"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.get('/:id', (0, authValidator_1.default)('admin', 'faculty'), faculty_controller_1.FacultyControllers.getSingleFaculty);
router.patch('/:id', (0, authValidator_1.default)('admin', 'faculty'), (0, validator_1.default)(faculty_validation_1.updateFacultyValidationSchema), faculty_controller_1.FacultyControllers.updateFaculty);
router.delete('/:id', (0, authValidator_1.default)('admin', 'faculty'), faculty_controller_1.FacultyControllers.deleteFaculty);
router.get('/', (0, authValidator_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.faculty), faculty_controller_1.FacultyControllers.getAllFaculties);
exports.FacultyRoutes = router;
