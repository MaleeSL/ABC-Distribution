
'use client';

import { useState, useEffect } from 'react';
import { customerService } from '@/services/customerService';

export default function CustomersPage() {

    const [customers, setCustomers] = useState([]);
    const [name, setName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState(null);

    // Customers load karanawa
    useEffect(() => {
        getCustomers();
    }, [search]);

    async function getCustomers() {
        const result = await customerService.getCustomers(search);
        if (result.success) {
            setCustomers(result.data);
        }
    }

    // Customer add karanawa
    async function saveCustomer(e) {
        e.preventDefault();

        if (name === '' || phone === '') {
            alert('Name and Phone are required');
            return;
        }

        const customerData = {
            name,
            business_name: businessName,
            phone,
            email,
            address
        };

        const result = editId !== null
            ? await customerService.updateCustomer(editId, customerData)
            : await customerService.createCustomer(customerData);

        if (result.success) {
            alert('Customer saved successfully!');
            getCustomers();
            clearForm();
        } else {
            alert(result.message);
        }
    }

    // Form eka clear karanawa
    function clearForm() {
        setName('');
        setBusinessName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setEditId(null);
    }

    // Edit karanna customer select karanawa
    function editCustomer(customer) {
        setName(customer.name);
        setBusinessName(customer.business_name || '');
        setPhone(customer.phone);
        setEmail(customer.email || '');
        setAddress(customer.address || '');
        setEditId(customer.id);
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <h1 className="text-2xl font-bold mb-6">
                Customer Management
            </h1>

            {/* Customer Form */}
            <div className="bg-white p-5 rounded shadow mb-6">

                <h2 className="text-lg font-bold mb-4">
                    {editId !== null ? 'Edit Customer' : 'Add New Customer'}
                </h2>

                <form onSubmit={saveCustomer}>

                    <input
                        type="text"
                        placeholder="Customer Name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded w-full mb-3"
                    />

                    <input
                        type="text"
                        placeholder="Business Name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="border p-2 rounded w-full mb-3"
                    />

                    <input
                        type="text"
                        placeholder="Phone Number *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border p-2 rounded w-full mb-3"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded w-full mb-3"
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border p-2 rounded w-full mb-3"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded"
                    >
                        {editId !== null ? 'Update Customer' : 'Save Customer'}
                    </button>

                    <button
                        type="button"
                        onClick={clearForm}
                        className="bg-gray-300 px-5 py-2 rounded ml-2"
                    >
                        Clear
                    </button>

                </form>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-full mb-4"
            />

            {/* Customer Table */}
            <div className="bg-white rounded shadow overflow-x-auto">

                <table className="w-full text-left">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Business</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {customers.map((customer) => {

                            if (
                                customer.name.toLowerCase().includes(search.toLowerCase()) ||
                                customer.phone.includes(search) ||
                                (customer.business_name || '').toLowerCase().includes(search.toLowerCase())
                            ) {
                                return (
                                    <tr key={customer.id} className="border-b">

                                        <td className="p-3">{customer.name}</td>
                                        <td className="p-3">{customer.business_name}</td>
                                        <td className="p-3">{customer.phone}</td>
                                        <td className="p-3">{customer.email}</td>

                                        <td className="p-3">
                                            <button
                                                onClick={() => editCustomer(customer)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                        </td>

                                    </tr>
                                );
                            }

                            return null;
                        })}
                    </tbody>

                </table>

            </div>

        </div>
    );
}
