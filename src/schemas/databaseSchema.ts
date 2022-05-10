import { Item } from './tableSchemas/itemSchema';
import { Document } from './tableSchemas/documentSchema';
import { User } from './tableSchemas/userSchema';
import { DocumentRelationship } from './tableSchemas/documentRelationshipSchema';
import { Project } from './tableSchemas/projectSchema';
import { Customer } from './tableSchemas/customerSchema';
import { DocumentAssignment } from './tableSchemas/documentAssignmentSchema';
import { Assignment } from './tableSchemas/assignmentSchema';
import { SapTeam } from './tableSchemas/sapTeamSchema';
import { Currency } from './tableSchemas/currencySchema';
import { Branch } from './tableSchemas/branchSchema';
import { SourceSystem } from './tableSchemas/sourceSystemSchema';
import { Workgroup } from './tableSchemas/workgroupSchema';
import { NCAReason } from './tableSchemas/nCAReasonSchema';
import { DocumentStatus } from './tableSchemas/documentStatusSchema';
import { Revision } from './tableSchemas/revisionSchema';
import { CustomerCoordinator } from './tableSchemas/custromerCoordinator';
import { Requester } from './tableSchemas/requesterSchema';

class DataBase {

  constructor() { }

  public relationShipStart() {

    // BRANCH ASSOCIATIONS ======================================
    Branch.hasMany(Document, { foreignKey: "COD_FILI", as: "documents" });
    Branch.hasMany(Customer, { foreignKey: "COD_FILI", as: "customers" });
    Branch.belongsTo(Currency, { foreignKey: "COD_MOEDA", as: "currency" });

    // CURRENCY ASSOCIATIONS ====================================
    Currency.hasMany(Document, { foreignKey: "COD_MOEDA", as: "documents" });

    // CUSTOMER ASSOCIATIONS ====================================
    Customer.hasMany(Document, { foreignKey: "COD_CLI", as: "documents" });
    Customer.belongsTo(Branch, { foreignKey: 'COD_FILI', as: 'branch' });
    Customer.hasMany(CustomerCoordinator, { foreignKey: "COD_CLI", as: "coordinators" });
    Customer.belongsTo(Currency, { foreignKey: "COD_MOEDA", as: "currency" });

    // CUSTOMER COORDINATOR ASSOCIATION =========================
    CustomerCoordinator.belongsTo(User, { foreignKey: "COD_COOR", as: 'coordinator' });
    CustomerCoordinator.belongsTo(Customer, { foreignKey: 'COD_CLI', as: "customer" });

    // DOCUMENT ASSOCIATIONS ====================================
    Document.belongsTo(User, { foreignKey: "COD_RESP", as: "responsible" });
    Document.belongsTo(User, { foreignKey: "COD_COOR", as: "coordinator" });
    Document.belongsTo(Customer, { foreignKey: "COD_CLI", as: "customer" });
    Document.belongsTo(Project, { foreignKey: "COD_PROJ", as: "project" });
    Document.belongsTo(SapTeam, { foreignKey: 'COD_EQUI_SAP', as: "sapteam" });
    Document.belongsTo(Currency, { foreignKey: 'COD_MOEDA', as: 'currency' });
    Document.belongsTo(SourceSystem, { foreignKey: 'COD_SIST', as: 'sourceSystem' });
    Document.belongsTo(Workgroup, { foreignKey: 'COD_AREA', as: 'workgroup' });
    Document.belongsTo(NCAReason, { foreignKey: 'COD_MOTI_NCA', as: 'ncareason' });
    Document.belongsTo(Requester, { foreignKey: 'COD_SOLI', as: 'requester' });
    Document.belongsTo(DocumentStatus, { foreignKey: 'COD_STATUS_DOC', as: 'documentstatus' });
    Document.belongsToMany(Document, { through: DocumentRelationship, foreignKey: "COD_1", otherKey: "COD_2", as: "offers" });
    Document.belongsToMany(Document, { through: DocumentRelationship, foreignKey: "COD_2", otherKey: "COD_1", as: "orders" });
    Document.hasMany(DocumentAssignment, { foreignKey: "COD_DOC", as: "assignments", onDelete: "cascade" });
    Document.hasMany(Revision, { foreignKey: "COD_DOC", as: "revisions", onDelete: "cascade" });
    Document.hasMany(Item, { foreignKey: "COD_DOC", as: "items", onDelete: "cascade" });

    // DOCUMENT ASSIGNMENT ASSOCIATIONS =========================
    DocumentAssignment.belongsTo(Document, { foreignKey: "COD_DOC", as: "document" });
    DocumentAssignment.belongsTo(Assignment, { foreignKey: "COD_TAR", as: "assignment" });
    DocumentAssignment.belongsTo(Branch, { foreignKey: 'COD_FILI', as: 'branch' });

    // DOCUMENT STATUS ASSOCIATIONS =============================
    DocumentStatus.hasMany(Document, { foreignKey: 'COD_STATUS_DOC', as: 'documents' });

    // ITEM ASSOCIATIONS ========================================
    Item.belongsTo(Document, { foreignKey: "COD_DOC", as: "document" });
    Item.belongsTo(Document, { foreignKey: "COD_OFERTA", as: "offer" });

    // NACREASON ASSOCIATIONS ===================================
    NCAReason.hasMany(Document, { foreignKey: 'COD_MOTI_NCA', as: 'documents' });

    // PROJECT ASSOCIATIONS =====================================
    Project.hasMany(Document, { foreignKey: "COD_PROJ", as: "documents" });
    Project.belongsTo(User, { foreignKey: "COD_USU", as: "responsible" });
    Project.belongsTo(User, { foreignKey: "COD_COOR_PROJ_OF", as: "coordinator" });

    // SAP TEAM ASSOCIATIONS ====================================
    SapTeam.hasMany(Document, { foreignKey: "COD_EQUI_SAP", as: "documents" });

    // SOURCE SYSTEM ASSOCIATIONS ===============================
    SourceSystem.hasMany(Document, { foreignKey: 'COD_SIST', as: 'documents' });

    //USER ASSOCIATIONS =========================================
    User.belongsTo(Workgroup, { foreignKey: 'COD_AREA', as: 'workgroup' });

    // WORKGROUP ASSOCIATIONS ===================================
    Workgroup.hasMany(Document, { foreignKey: 'COD_AREA', as: 'documents' });
    Workgroup.hasMany(User, { foreignKey: 'COD_AREA', as: 'users' });
  }

  public dataBaseReset() {

  }
}

export default new DataBase();
