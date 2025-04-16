'use client'

import { useState } from 'react'
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash, X } from 'lucide-react'
import { LearningPathType } from '@/hooks/useLearningPath'

interface EditPathDialogProps {
  path: LearningPathType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (path: LearningPathType) => void;
  isLoading?: boolean;
}

export function EditPathDialog({ 
  path, 
  isOpen, 
  onOpenChange, 
  onSave, 
  isLoading = false 
}: EditPathDialogProps) {
  const [editedPath, setEditedPath] = useState<LearningPathType>(path);

  // Deep clone the path object to avoid mutations
  const resetForm = () => {
    setEditedPath(JSON.parse(JSON.stringify(path)));
  };

  // Reset form when dialog opens with new path data
  if (isOpen && JSON.stringify(path) !== JSON.stringify(editedPath)) {
    resetForm();
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPath(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMilestoneChange = (index: number, field: string, value: any) => {
    setEditedPath(prev => {
      const newMilestones = [...prev.milestones];
      newMilestones[index] = {
        ...newMilestones[index],
        [field]: value
      };
      return {
        ...prev,
        milestones: newMilestones
      };
    });
  };

  const handleSkillChange = (milestoneIndex: number, skillIndex: number, value: string) => {
    setEditedPath(prev => {
      const newMilestones = [...prev.milestones];
      const newSkills = [...newMilestones[milestoneIndex].skills];
      newSkills[skillIndex] = value;
      newMilestones[milestoneIndex] = {
        ...newMilestones[milestoneIndex],
        skills: newSkills
      };
      return {
        ...prev,
        milestones: newMilestones
      };
    });
  };

  const addSkill = (milestoneIndex: number) => {
    setEditedPath(prev => {
      const newMilestones = [...prev.milestones];
      newMilestones[milestoneIndex] = {
        ...newMilestones[milestoneIndex],
        skills: [...newMilestones[milestoneIndex].skills, '']
      };
      return {
        ...prev,
        milestones: newMilestones
      };
    });
  };

  const removeSkill = (milestoneIndex: number, skillIndex: number) => {
    setEditedPath(prev => {
      const newMilestones = [...prev.milestones];
      const newSkills = [...newMilestones[milestoneIndex].skills];
      newSkills.splice(skillIndex, 1);
      newMilestones[milestoneIndex] = {
        ...newMilestones[milestoneIndex],
        skills: newSkills
      };
      return {
        ...prev,
        milestones: newMilestones
      };
    });
  };

  const handleCareerChange = (index: number, field: string, value: string) => {
    setEditedPath(prev => {
      const newCareers = [...prev.career_opportunities];
      newCareers[index] = {
        ...newCareers[index],
        [field]: value
      };
      return {
        ...prev,
        career_opportunities: newCareers
      };
    });
  };

  const handleSave = () => {
    onSave(editedPath);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Customize Your Learning Path</DialogTitle>
          <DialogDescription>
            Tailor your learning path to match your specific goals and interests.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6 py-4">
            {/* Path Title and Description */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="path_title">Path Title</Label>
                <Input 
                  id="path_title"
                  name="path_title"
                  value={editedPath.path_title}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="path_description">Path Description</Label>
                <Textarea 
                  id="path_description"
                  name="path_description"
                  value={editedPath.path_description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
            
            {/* Milestones */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Milestones</h3>
              
              {editedPath.milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Milestone {index + 1}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`milestone-${index}-title`}>Title</Label>
                    <Input 
                      id={`milestone-${index}-title`}
                      value={milestone.title}
                      onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`milestone-${index}-description`}>Description</Label>
                    <Textarea 
                      id={`milestone-${index}-description`}
                      value={milestone.description}
                      onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`milestone-${index}-timeframe`}>Timeframe</Label>
                    <Input 
                      id={`milestone-${index}-timeframe`}
                      value={milestone.timeframe}
                      onChange={(e) => handleMilestoneChange(index, 'timeframe', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Skills</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => addSkill(index)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Skill
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {milestone.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex items-center gap-2">
                          <Input 
                            value={skill}
                            onChange={(e) => handleSkillChange(index, skillIndex, e.target.value)}
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeSkill(index, skillIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`milestone-${index}-project`}>Project</Label>
                    <Textarea 
                      id={`milestone-${index}-project`}
                      value={milestone.project}
                      onChange={(e) => handleMilestoneChange(index, 'project', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Career Opportunities */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Career Opportunities</h3>
              
              {editedPath.career_opportunities.map((career, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`career-${index}-title`}>Title</Label>
                    <Input 
                      id={`career-${index}-title`}
                      value={career.title}
                      onChange={(e) => handleCareerChange(index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`career-${index}-description`}>Description</Label>
                    <Textarea 
                      id={`career-${index}-description`}
                      value={career.description}
                      onChange={(e) => handleCareerChange(index, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-vikasini-orange hover:bg-vikasini-orange/90"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 