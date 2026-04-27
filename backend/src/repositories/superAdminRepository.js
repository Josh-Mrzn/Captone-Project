import User from '../models/User.js';
import AdminApproval from '../models/AdminApproval.js';
import AdminAuditLog from '../models/AdminAuditLog.js';

class SuperAdminRepository {
  async findAllUsers() {
    return User.find().select('-password');
  }

  // Helper to determine if we should query by the integer userId or MongoDB _id
  getQuery(id) {
    // If id is a number (or string that is a number), use the custom userId field
    if (!isNaN(id) && !id.toString().match(/^[0-9a-fA-F]{24}$/)) {
      return { userId: parseInt(id) };
    }
    // Otherwise, assume it's a standard MongoDB ObjectId
    return { _id: id };
  }

  async findUserById(id) {
    const query = this.getQuery(id);
    return User.findOne(query).select('-password');
  }

  async updateUser(id, data) {
    const query = this.getQuery(id);
    return User.findOneAndUpdate(query, data, { new: true }).select('-password');
  }

  async deleteUser(id) {
    const query = this.getQuery(id);
    return User.findOneAndDelete(query);
  }

async findPendingApprovals() {
  return User.find({ status: 'pending' }).select('-password');
}

  async updateApproval(id, data) {
    return AdminApproval.findByIdAndUpdate(id, data, { new: true });
  }

  async createAuditLog(data) {
    return AdminAuditLog.create(data);
  }

  async createUser(userData) {
    return User.create(userData);
  }
}

export default new SuperAdminRepository();