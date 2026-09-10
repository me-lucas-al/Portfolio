import { CreateTimelineMilestoneType, DeleteTimelineMilestoneType, UpdateTimelineMilestoneType } from "@portfolio/packages/schemas/timeline-milestone/index";
import { ITimelineMilestoneRepository } from "../../repositories/timeline-milestone-repository.interface";

export class TimelineMilestoneService {
  constructor(private timelineMilestoneRepository: ITimelineMilestoneRepository) {}

  async createMilestone(data: CreateTimelineMilestoneType) {
    return this.timelineMilestoneRepository.create(data);
  }

  async getAllMilestones() {
    return this.timelineMilestoneRepository.findAll();
  }

  async deleteMilestoneById(data: DeleteTimelineMilestoneType) {
    return this.timelineMilestoneRepository.delete(data.id);
  }

  async updateMilestoneById(data: UpdateTimelineMilestoneType) {
    return this.timelineMilestoneRepository.update(data);
  }
}
