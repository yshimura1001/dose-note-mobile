import { reactive } from 'vue';

export interface Medicine {
  id: number;
  name: string;
  type: string;
  dosage: string;
}

export interface Task {
  id: number;
  medicineId: number;
  time: string;
  dosage: string;
  taken: boolean;
  skipped: boolean;
}

export const store = reactive({
  medicines: [
    { id: 1, name: 'アムロジピン', type: '錠剤', dosage: '1錠' },
    { id: 2, name: 'メトホルミン', type: '錠剤', dosage: '1錠' },
  ] as Medicine[],

  tasks: [
    { id: 1, medicineId: 1, time: '08:00', dosage: '1錠', taken: true, skipped: false },
    { id: 2, medicineId: 2, time: '12:00', dosage: '1錠', taken: false, skipped: false },
    { id: 3, medicineId: 1, time: '18:00', dosage: '1錠', taken: false, skipped: false },
  ] as Task[],

  addMedicine(medicine: Omit<Medicine, 'id'>) {
    const id = Date.now();
    this.medicines.push({ ...medicine, id });
  },

  updateMedicine(medicine: Medicine) {
    const index = this.medicines.findIndex(m => m.id === medicine.id);
    if (index !== -1) {
      this.medicines[index] = medicine;
    }
  },

  deleteMedicine(id: number) {
    this.medicines = this.medicines.filter(m => m.id !== id);
    // 関連するタスクも削除
    this.tasks = this.tasks.filter(t => t.medicineId !== id);
  },

  addTask(task: Omit<Task, 'id' | 'taken' | 'skipped'>) {
    const id = Date.now();
    this.tasks.push({ ...task, id, taken: false, skipped: false });
  },

  updateTask(task: Task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
    }
  },

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  },

  getMedicineById(id: number) {
    return this.medicines.find(m => m.id === id);
  }
});
