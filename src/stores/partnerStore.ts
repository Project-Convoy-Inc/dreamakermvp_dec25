import { create } from 'zustand';
import { Partner } from '@/types/dream';

interface PartnerStore {
  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id'>) => void;
  removePartner: (id: string) => void;
}

// Sample partners for demo
const samplePartners: Partner[] = [
  { id: 'p1', name: 'Sarah Chen', email: 'sarah.chen@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 'p2', name: 'Mike Johnson', email: 'mike.johnson@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 'p3', name: 'Emma Wilson', email: 'emma.wilson@example.com', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 'p4', name: 'David Park', email: 'david.park@example.com', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 'p5', name: 'Lisa Martinez', email: 'lisa.martinez@example.com', avatar: 'https://i.pravatar.cc/150?img=9' },
];

export const usePartnerStore = create<PartnerStore>((set) => ({
  partners: samplePartners,
  
  addPartner: (partner) => {
    const newPartner: Partner = {
      ...partner,
      id: crypto.randomUUID(),
    };
    set((state) => ({ partners: [...state.partners, newPartner] }));
  },
  
  removePartner: (id) => {
    set((state) => ({
      partners: state.partners.filter((partner) => partner.id !== id),
    }));
  },
}));
