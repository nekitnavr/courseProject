import { useEffect, useState } from "react";

export default function useRowSelect(items){
    const [selectedRows, setSelectedRows] = useState(new Set())
    const [selectAll, setSelectAll] = useState(false)

    useEffect(() => {
        if (items?.length > 0) {
            setSelectAll(selectedRows.size == items.length)
        } else {
            setSelectAll(false)
        }
    }, [selectedRows, items]);

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedRows(new Set())
        } else {
            const allIds = items.map(el => el.id)
            setSelectedRows(new Set(allIds))
        }
    }

    const deselectAll = ()=>{
        setSelectedRows(new Set());
    }

    const toggleRow = (id) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedRows(newSelected)
    }

    const isSelected = (id)=>{
        return selectedRows.has(id)
    }

    const getSelectedRows = ()=>{
        return selectedRows ? [...selectedRows] : []
    }

    return {toggleSelectAll, deselectAll, toggleRow, isSelected, selectedRows, selectAll, getSelectedRows}
}