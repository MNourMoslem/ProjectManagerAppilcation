import React, { use, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import TableWithPagination from './TableWithPagination';
import { Column } from './TableWithPagination';
import { MemberCard } from '../members';
import { ProjectMember as Member } from '../../interfaces/interfaces';

function MemberTable({projectId}: {projectId: string}) {
    const memberColumns: Column<Member>[] = [
        {
            id: 'name',
            header: 'Member',
            accessor: (member) => (
                <MemberCard
                    id={member?._id || ''}
                    name={member?.name || ''}
                    email={member?.email || ''}
                    role={member?.role || ''}
                />
            ),
            sortable: true,
            sortFn: (a, b) => a?.name?.localeCompare(b?.name),
        },
        {
            id: 'role',
            header: 'Role',      
            accessor: (member) => {
                const roleStyles = {
                'owner': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
                'admin': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                'member': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                };
                
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleStyles[member.role]}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                );
            },
            sortable: true,
            sortFn: (a, b) => a.role.localeCompare(b.role),
            width: '120px',
        },
    ];

    const {
        members,
        fetchProjectMembers,
    } = useProjectStore();

    useEffect(() => {
        fetchProjectMembers(projectId);
    }, [fetchProjectMembers]);

    return (
        <TableWithPagination
            columns={memberColumns}
            data={members || []}
            itemsPerPage={10}
        />
    )
}

export default MemberTable