'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { GraduationCap, Plus, X, Video, FileText, Users } from 'lucide-react';
import { toast } from 'react-toastify';

interface VideoResource {
    title: string;
    url: string;
}

interface DocumentResource {
    title: string;
    url: string;
}

interface TrainingFormData {
    title: string;
    description: string;
    assignedRoles: string[];
    videos: VideoResource[];
    documents: DocumentResource[];
}

const ROLE_OPTIONS = [
    { value: 'CHEF', label: 'Chef', icon: '👨‍🍳', color: 'from-orange-500 to-orange-600' },
    { value: 'WAITER', label: 'Nhân viên phục vụ', icon: '🍽️', color: 'from-blue-500 to-blue-600' },
    { value: 'CASHIER', label: 'Thu ngân', icon: '💰', color: 'from-green-500 to-green-600' },
    { value: 'MANAGER', label: 'Quản lý', icon: '👔', color: 'from-purple-500 to-purple-600' },
];

export function AddTrainingDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<TrainingFormData>({
        title: '',
        description: '',
        assignedRoles: [],
        videos: [{ title: '', url: '' }],
        documents: [{ title: '', url: '' }],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tên khóa đào tạo';
        if (!formData.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';
        if (formData.assignedRoles.length === 0) newErrors.assignedRoles = 'Vui lòng chọn ít nhất 1 vai trò';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        setTimeout(() => {
            toast.success('✅ Tạo khóa đào tạo thành công!');
            setOpen(false);
            resetForm();
            setIsLoading(false);
        }, 1000);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            assignedRoles: [],
            videos: [{ title: '', url: '' }],
            documents: [{ title: '', url: '' }],
        });
        setErrors({});
    };

    const toggleRole = (roleValue: string) => {
        setFormData(prev => ({
            ...prev,
            assignedRoles: prev.assignedRoles.includes(roleValue)
                ? prev.assignedRoles.filter(r => r !== roleValue)
                : [...prev.assignedRoles, roleValue]
        }));
    };

    const addVideo = () => {
        setFormData(prev => ({
            ...prev,
            videos: [...prev.videos, { title: '', url: '' }]
        }));
    };

    const removeVideo = (index: number) => {
        if (formData.videos.length > 1) {
            setFormData(prev => ({
                ...prev,
                videos: prev.videos.filter((_, i) => i !== index)
            }));
        }
    };

    const updateVideo = (index: number, field: keyof VideoResource, value: string) => {
        setFormData(prev => ({
            ...prev,
            videos: prev.videos.map((video, i) =>
                i === index ? { ...video, [field]: value } : video
            )
        }));
    };

    const addDocument = () => {
        setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, { title: '', url: '' }]
        }));
    };

    const removeDocument = (index: number) => {
        if (formData.documents.length > 1) {
            setFormData(prev => ({
                ...prev,
                documents: prev.documents.filter((_, i) => i !== index)
            }));
        }
    };

    const updateDocument = (index: number, field: keyof DocumentResource, value: string) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.map((doc, i) =>
                i === index ? { ...doc, [field]: value } : doc
            )
        }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-11 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold">
                    <Plus size={22} className="mr-2" strokeWidth={2.5} />
                    Tạo Khóa Đào Tạo
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        <GraduationCap size={28} className="text-orange-500" />
                        Tạo Khóa Đào Tạo Mới
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <GraduationCap size={16} className="text-orange-500" />
                            Tên khóa đào tạo <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="VD: Cách làm món Phở, Quy trình phục vụ bàn..."
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className={`h-11 border-2 ${errors.title ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 transition-all`}
                        />
                        {errors.title && <p className="text-xs text-red-600 font-medium">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Mô tả chi tiết về nội dung và mục tiêu khóa đào tạo..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className={`w-full px-3 py-2 rounded-md border-2 ${errors.description ? 'border-red-400' : 'border-gray-200'} focus:border-orange-500 focus:ring-orange-500/20 focus:ring-4 outline-none transition-all`}
                        />
                        {errors.description && <p className="text-xs text-red-600 font-medium">{errors.description}</p>}
                    </div>

                    {/* Assigned Roles */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Users size={16} className="text-orange-500" />
                            Phân quyền cho vai trò <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {ROLE_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleRole(option.value)}
                                    className={`p-3 rounded-xl border-2 transition-all ${formData.assignedRoles.includes(option.value)
                                            ? `bg-gradient-to-br ${option.color} text-white border-transparent shadow-lg`
                                            : 'bg-white border-gray-200 hover:border-orange-300'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{option.icon}</div>
                                    <div className={`text-sm font-bold ${formData.assignedRoles.includes(option.value) ? 'text-white' : 'text-gray-700'}`}>
                                        {option.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                        {errors.assignedRoles && <p className="text-xs text-red-600 font-medium">{errors.assignedRoles}</p>}
                        <p className="text-xs text-gray-500">Chọn các vai trò được phép xem và học khóa đào tạo này</p>
                    </div>

                    {/* Video Resources */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Video size={16} className="text-orange-500" />
                                Video hướng dẫn
                            </label>
                            <Button type="button" size="sm" onClick={addVideo} variant="outline" className="text-orange-600 border-orange-600">
                                <Plus size={16} className="mr-1" /> Thêm Video
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.videos.map((video, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="Tiêu đề video"
                                        value={video.title}
                                        onChange={(e) => updateVideo(index, 'title', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Input
                                        placeholder="URL video (YouTube, Vimeo...)"
                                        value={video.url}
                                        onChange={(e) => updateVideo(index, 'url', e.target.value)}
                                        className="flex-1"
                                    />
                                    {formData.videos.length > 1 && (
                                        <Button type="button" size="sm" variant="outline" onClick={() => removeVideo(index)} className="text-red-600">
                                            <X size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">Thêm link video từ YouTube, Vimeo hoặc nền tảng khác</p>
                    </div>

                    {/* Document Resources */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FileText size={16} className="text-orange-500" />
                                Tài liệu hướng dẫn
                            </label>
                            <Button type="button" size="sm" onClick={addDocument} variant="outline" className="text-orange-600 border-orange-600">
                                <Plus size={16} className="mr-1" /> Thêm Tài Liệu
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.documents.map((doc, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="Tiêu đề tài liệu"
                                        value={doc.title}
                                        onChange={(e) => updateDocument(index, 'title', e.target.value)}
                                        className="flex-1"
                                    />
                                    <Input
                                        placeholder="URL tài liệu (PDF, Google Docs...)"
                                        value={doc.url}
                                        onChange={(e) => updateDocument(index, 'url', e.target.value)}
                                        className="flex-1"
                                    />
                                    {formData.documents.length > 1 && (
                                        <Button type="button" size="sm" variant="outline" onClick={() => removeDocument(index)} className="text-red-600">
                                            <X size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">Thêm link tài liệu PDF, Google Docs hoặc tài liệu khác</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                resetForm();
                            }}
                            disabled={isLoading}
                            className="flex-1 h-11 border-2 border-gray-300 bg-white !text-gray-900 hover:!bg-gray-100 hover:!text-gray-900 font-semibold"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Plus size={18} className="mr-2" />
                                    Tạo Khóa Đào Tạo
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
