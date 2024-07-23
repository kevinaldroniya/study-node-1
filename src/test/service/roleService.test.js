const fs = require('fs');
const roleService = require('./../../services/roleService');
const path = require('path');
const roleFilePath = path.join(__dirname, './../../data/roles.json');

jest.mock('fs');
// jest.mock('./../../services/roleService')

const mockRoles = [
    {id: 1, role: 'superadmin'},
    {id: 2, role: 'admin'}
];

beforeEach(() => {
    jest.clearAllMocks();
})

describe('getAllRolesFromData', () => {
    it('should return all roles on data', async () => {
        fs.readFileSync.mockReturnValue(JSON.stringify(mockRoles));
        const data =roleService.getAllUsers();
        
        expect(data.length).toBe(2)
        expect(data.indexOf(0)).toBe(mockRoles.indexOf(0))
    });
});


describe('getRoleById', () => {
    it('should return role by id', () => {
        jest.spyOn(roleService, 'getAllUsers').mockReturnValue(mockRoles);

        const role = roleService.getRoleById(1)
        expect(role.role).toBe('superadmin');
    });
});

describe('saveRole', () => {
    it.only('should save role', async () => {
        // jest.spyOn(roleService, 'getAllUsers').mockReturnValue(mockRoles);
        const newRole = [
            {id: 1, role: 'superadmin'},
            {id: 2, role: 'admin'},
            {id: 3, role: 'user'}
        ];
        
        roleService.saveRole(newRole);

        const newRolesData = JSON.stringify(newRole, null, 2)
        expect(fs.writeFileSync).toHaveBeenCalledWith(roleFilePath, newRolesData, 'utf-8');
    });
});