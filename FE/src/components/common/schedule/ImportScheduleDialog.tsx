'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import ExcelJS from 'exceljs';

interface ImportScheduleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    users: Array<{ id: number; name: string }>;
    onSuccess: () => void;
}

interface ImportRow {
    userId: number | null;
    shiftId: number | null;
    date: string;
    description: string | null;
    errors: string[];
    isValid: boolean;
}

export function ImportScheduleDialog({
    open,
    onOpenChange,
    users,
    onSuccess
}: ImportScheduleDialogProps) {
    const [importData, setImportData] = useState<ImportRow[]>([]);
    const [fileName, setFileName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [shifts, setShifts] = useState<Array<{ id: number; name: string }>>([]);

    useEffect(() => {
        if (open) {
            fetchShifts();
        }
    }, [open]);

    const fetchShifts = async () => {
        try {
            const branchId = document.cookie.split('; ').find(row => row.startsWith('branchId='))?.split('=')[1];
            let url = '/api/shifts';

            if (branchId) {
                const branchIdNum = parseInt(branchId, 10);
                if (!isNaN(branchIdNum) && branchIdNum > 0) {
                    url = `/api/shifts?branchId=${branchIdNum}`;
                }
            }

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status === 0 && data.data) {
                    const shiftList = Array.isArray(data.data) ? data.data : [];
                    setShifts(shiftList.map((shift: { id: number; name: string }) => ({
                        id: shift.id,
                        name: shift.name
                    })));
                }
            }
        } catch (error) {
            console.error('Failed to fetch shifts:', error);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Lịch trình');

            worksheet.columns = [
                { header: 'User Id', key: 'userId', width: 15 },
                { header: 'Shift Id', key: 'shiftId', width: 15 },
                { header: 'Date', key: 'date', width: 20 },
                { header: 'Description', key: 'description', width: 30 },
            ];

            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF78A243' }
            };
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };

            if (users.length > 0 && shifts.length > 0) {
                worksheet.addRow({
                    userId: users[0].id,
                    shiftId: shifts[0].id,
                    date: '2025-01-15',
                    description: 'Làm việc buổi sáng'
                });
            } else {
                worksheet.addRow({
                    userId: 1,
                    shiftId: 1,
                    date: '2025-01-15',
                    description: 'Ví dụ mô tả'
                });
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `mau_import_lich_trinh.xlsx`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success('Đã tải file mẫu!');
        } catch (error) {
            console.error('Error creating template:', error);
            toast.error('Không thể tạo file mẫu!');
        }
    };

    const validateImportData = (rows: ImportRow[]): ImportRow[] => {
        return rows.map(row => {
            const errors: string[] = [];

            if (row.userId === null || row.userId === undefined || isNaN(row.userId) || row.userId <= 0) {
                errors.push('User Id không hợp lệ');
            } else {
                const user = users.find(u => u.id === row.userId);
                if (!user) {
                    errors.push(`Không tìm thấy nhân viên với User Id: ${row.userId}`);
                }
            }

            if (row.shiftId === null || row.shiftId === undefined || isNaN(row.shiftId) || row.shiftId <= 0) {
                errors.push('Shift Id không hợp lệ');
            } else {
                const shift = shifts.find(s => s.id === row.shiftId);
                if (!shift) {
                    errors.push(`Không tìm thấy ca làm việc với Shift Id: ${row.shiftId}`);
                }
            }

            if (!row.date || !row.date.trim()) {
                errors.push('Thiếu ngày');
            } else {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(row.date)) {
                    errors.push('Ngày không đúng định dạng (YYYY-MM-DD)');
                } else {
                    const dateObj = new Date(row.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (dateObj < today) {
                        errors.push('Ngày không được trước ngày hôm nay');
                    }
                }
            }


            return {
                ...row,
                errors,
                isValid: errors.length === 0
            };
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setSelectedFile(file);
        setImportData([]); // Clear previous data

        // Optional: Preview file data (for validation display)
        try {
            const workbook = new ExcelJS.Workbook();
            const arrayBuffer = await file.arrayBuffer();
            await workbook.xlsx.load(arrayBuffer);

            const worksheet = workbook.worksheets[0];
            if (!worksheet) {
                toast.error('File không có sheet nào!');
                return;
            }

            const rows: ImportRow[] = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;

                const userIdValue = row.getCell(1).value;
                const shiftIdValue = row.getCell(2).value;
                const date = row.getCell(3).value?.toString() || '';
                const description = row.getCell(4).value?.toString() || null;

                if (!userIdValue && !shiftIdValue && !date) return;

                let userId: number | null = null;
                if (userIdValue !== null && userIdValue !== undefined) {
                    if (typeof userIdValue === 'number') {
                        userId = userIdValue;
                    } else {
                        const parsed = parseInt(userIdValue.toString(), 10);
                        if (!isNaN(parsed)) {
                            userId = parsed;
                        }
                    }
                }

                let shiftId: number | null = null;
                if (shiftIdValue !== null && shiftIdValue !== undefined) {
                    if (typeof shiftIdValue === 'number') {
                        shiftId = shiftIdValue;
                    } else {
                        const parsed = parseInt(shiftIdValue.toString(), 10);
                        if (!isNaN(parsed)) {
                            shiftId = parsed;
                        }
                    }
                }

                rows.push({
                    userId,
                    shiftId,
                    date,
                    description,
                    errors: [],
                    isValid: false
                });
            });

            if (rows.length === 0) {
                toast.warning('File không có dữ liệu!');
                return;
            }

            const validatedData = validateImportData(rows);
            setImportData(validatedData);

            const validCount = validatedData.filter(r => r.isValid).length;
            const invalidCount = validatedData.length - validCount;

            if (invalidCount > 0) {
                toast.warning(`Đã tải ${rows.length} dòng. ${validCount} dòng hợp lệ, ${invalidCount} dòng có lỗi.`);
            } else {
                toast.success(`Đã tải ${rows.length} dòng hợp lệ!`);
            }
        } catch (error) {
            console.error('Error reading file:', error);
            toast.warning('Không thể đọc file Excel để preview, nhưng vẫn có thể import!');
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            toast.error('Vui lòng chọn file Excel!');
            return;
        }

        setSubmitting(true);
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const base64 = btoa(
                new Uint8Array(arrayBuffer).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );

            const response = await fetch('/api/schedules/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    file: base64,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.desc || result.message || result.error || 'Failed to import schedules');
            }

            if (result.status === 0 || result.status === 200) {
                toast.success(result.desc || 'Import lịch trình thành công!');
                onSuccess();
                handleClose();
            } else {
                throw new Error(result.desc || 'Import thất bại');
            }
        } catch (error) {
            console.error('Error importing schedules:', error);
            const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi import!';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setImportData([]);
        setFileName('');
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-[#78A243]" />
                        Import lịch trình từ Excel
                    </DialogTitle>
                    <DialogDescription>
                        Tải file Excel mẫu hoặc upload file Excel để import lịch trình
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="font-semibold text-gray-900">Tải file mẫu</p>
                                <p className="text-sm text-gray-600">Tải file Excel mẫu để xem định dạng dữ liệu</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleDownloadTemplate}
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            size="sm"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Tải mẫu
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Upload file Excel</label>
                        <div className="flex items-center gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="schedule-file-input"
                            />
                            <label
                                htmlFor="schedule-file-input"
                                className="flex-1 cursor-pointer"
                            >
                                <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#78A243] transition-colors">
                                    <Upload className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {fileName || 'Chọn file Excel (.xlsx, .xls)'}
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {importData.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700">
                                    Xem trước dữ liệu ({importData.filter(r => r.isValid).length}/{importData.length} hợp lệ)
                                </label>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">User Id</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Shift Id</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Ngày</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Mô tả</th>
                                            <th className="px-3 py-2 text-left font-semibold text-gray-700">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {importData.map((row, index) => {
                                            const user = users.find(u => u.id === row.userId);
                                            const shift = shifts.find(s => s.id === row.shiftId);
                                            return (
                                                <tr
                                                    key={index}
                                                    className={`border-t ${row.isValid ? 'bg-white' : 'bg-red-50'}`}
                                                >
                                                    <td className="px-3 py-2">
                                                        {row.userId} {user && `(${user.name})`}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {row.shiftId} {shift && `(${shift.name})`}
                                                    </td>
                                                    <td className="px-3 py-2">{row.date}</td>
                                                    <td className="px-3 py-2">{row.description || '-'}</td>
                                                    <td className="px-3 py-2">
                                                        {row.isValid ? (
                                                            <Badge className="bg-green-100 text-green-800">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Hợp lệ
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-red-100 text-red-800">
                                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                                Lỗi
                                                            </Badge>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {importData.some(r => !r.isValid) && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-red-700">Chi tiết lỗi:</label>
                                    <div className="max-h-[200px] overflow-y-auto border border-red-200 rounded-lg p-3 bg-red-50">
                                        {importData
                                            .filter(r => !r.isValid)
                                            .map((row, index) => {
                                                const user = users.find(u => u.id === row.userId);
                                                return (
                                                    <div key={index} className="text-sm text-red-800 mb-2">
                                                        <p className="font-semibold">
                                                            Dòng {importData.indexOf(row) + 2}: User Id {row.userId || 'N/A'} {user && `(${user.name})`} - Shift Id {row.shiftId || 'N/A'}
                                                        </p>
                                                        <ul className="list-disc list-inside ml-2">
                                                            {row.errors.map((error, errIndex) => (
                                                                <li key={errIndex}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={submitting}>
                        <X className="w-4 h-4 mr-2" />
                        Đóng
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || !selectedFile}
                        className="bg-[#78A243] hover:bg-[#78A243]/90"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang import...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Import
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

