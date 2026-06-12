import { useState, useEffect } from 'react';
import { serviceAPI, categoryAPI, salonAPI } from '../services/api';

export default function AdminServices() {
  const [salon, setSalon] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [showAddService, setShowAddService] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', duration: '', categoryId: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '' });

  // Edit Service states
  const [showEditService, setShowEditService] = useState(false);
  const [editServiceForm, setEditServiceForm] = useState({ id: '', name: '', description: '', price: '', duration: '', categoryId: '' });

  const handleOpenEditService = (service) => {
    setEditServiceForm({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      categoryId: service.categoryId || ''
    });
    setShowEditService(true);
  };

  const loadData = async () => {
    try {
      const ownedSalon = await salonAPI.getOwned();
      if (ownedSalon) {
        setSalon(ownedSalon);
        const [servicesData, categoriesData] = await Promise.all([
          serviceAPI.getBySalon(ownedSalon.id),
          categoryAPI.getBySalon(ownedSalon.id),
        ]);
        setOfferings(servicesData || []);
        setCategories(categoriesData || []);
        if (categoriesData && categoriesData.length > 0) {
          setServiceForm(prev => ({ ...prev, categoryId: categoriesData[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load catalog data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await serviceAPI.create({
        name: serviceForm.name,
        description: serviceForm.description,
        price: Number(serviceForm.price),
        duration: Number(serviceForm.duration),
        categoryId: Number(serviceForm.categoryId),
        salonId: salon.id
      });
      setShowAddService(false);
      setServiceForm({ name: '', description: '', price: '', duration: '', categoryId: categories[0]?.id || '' });
      loadData();
    } catch (err) {
      console.error('Failed to create service offering', err);
      alert('Failed to add service. Please verify inputs.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryAPI.create({
        name: categoryForm.name,
        image: categoryForm.icon || '✨'
      });
      setShowAddCategory(false);
      setCategoryForm({ name: '', icon: '' });
      loadData();
    } catch (err) {
      console.error('Failed to create category', err);
      alert('Failed to create category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? All services under this category will become uncategorized.')) return;
    try {
      await categoryAPI.delete(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete category', err);
      alert('Failed to delete category. Make sure it is not in use or try again.');
    }
  };

  const handleEditServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await serviceAPI.update(editServiceForm.id, {
        name: editServiceForm.name,
        description: editServiceForm.description,
        price: Number(editServiceForm.price),
        duration: Number(editServiceForm.duration),
        categoryId: Number(editServiceForm.categoryId),
        salonId: salon.id
      });
      setShowEditService(false);
      loadData();
    } catch (err) {
      console.error('Failed to update service offering', err);
      alert('Failed to update service. Please verify inputs.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 rounded-full border border-t-[#C9A96E] animate-spin mx-auto"></div>
        <p className="text-[12px] text-[#A09A91] mt-2">Loading service catalog...</p>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E6E1] max-w-md mx-auto shadow-sm">
        <p className="font-display text-[1.8rem] font-light text-[#1C1C1A]">Register Salon Branch First</p>
        <p className="text-[13px] text-[#A09A91] mt-2">You need to register your branch in the Salons tab before managing catalog items.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadein">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="grid grid-cols-3 gap-4 flex-1">
          {[
            { label: 'Total Offerings',  val: offerings.length },
            { label: 'Avg. Price',        val: offerings.length ? `₹${Math.round(offerings.reduce((a,b)=>a+b.price,0)/offerings.length).toLocaleString()}` : '₹0' },
            { label: 'Avg. Duration',     val: offerings.length ? `${Math.round(offerings.reduce((a,b)=>a+b.duration,0)/offerings.length)} min` : '0 min' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
              <p className="text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider">{k.label}</p>
              <p className="font-display text-[1.9rem] font-light text-[#1C1C1A] mt-1.5">{k.val}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddCategory(true)}
            className="bg-white border border-[#E8E6E1] hover:border-[#C9A96E] text-[#1C1C1A] text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-all">
            + New Category
          </button>
          <button onClick={() => setShowAddService(true)}
            className="bg-[#1C1C1A] hover:bg-[#C9A96E] text-white text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-colors">
            + Add Service
          </button>
        </div>
      </div>

      {/* Categories Chip List */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-sm">
        <h3 className="text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-3">Salon Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-[12px] text-[#A09A91]">No categories created yet. Click "+ New Category" to get started.</p>
          ) : categories.map(c => (
            <div key={c.id} className="flex items-center gap-2 bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-3 py-1.5 text-[12px] font-medium text-[#1C1C1A]">
              <span>{c.image || c.icon || '✨'} {c.name}</span>
              <button onClick={() => handleDeleteCategory(c.id)}
                className="text-red-500 hover:text-red-700 font-bold ml-1 text-[13.5px] transition-colors"
                title="Delete Category">
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-display text-[1.4rem] font-light mb-4">Create Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Category Name</label>
                <input required value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Haircut, Spa"
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Icon (Emoji)</label>
                <input value={categoryForm.icon} onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  placeholder="e.g. ✂️, 💅"
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddCategory(false)}
                  className="flex-1 border border-[#E8E6E1] text-[#6B6560] py-2.5 rounded-xl font-semibold text-[13px]">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-[#1C1C1A] text-white py-2.5 rounded-xl font-semibold text-[13px] hover:bg-[#C9A96E]">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Offering Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-display text-[1.4rem] font-light mb-4">Add Catalog Service</h3>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Service Name</label>
                <input required value={serviceForm.name} onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g. Signature Blowdry"
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Description</label>
                <textarea required value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Service description details..."
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E] resize-none" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Price (₹)</label>
                  <input required type="number" value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="900"
                    className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Duration (min)</label>
                  <input required type="number" value={serviceForm.duration} onChange={e => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="60"
                    className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Category</label>
                <select value={serviceForm.categoryId} onChange={e => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]">
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.image || c.icon || '✨'} {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddService(false)}
                  className="flex-1 border border-[#E8E6E1] text-[#6B6560] py-2.5 rounded-xl font-semibold text-[13px]">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-[#1C1C1A] text-white py-2.5 rounded-xl font-semibold text-[13px] hover:bg-[#C9A96E]">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offerings list */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE8]">
          <h2 className="font-display text-[17px] font-light text-[#1C1C1A]">Service Catalog List</h2>
          <p className="text-[10px] text-[#A09A91] mt-0.5">service-offering · Service offerings registered for this salon branch</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F0EDE8] bg-[#FAFAF8]">
                {['ID', 'Name', 'Description', 'Category', 'Duration', 'Price', 'Actions'].map(h => (
                  <th key={h} className={`px-5 py-3.5 text-left text-[10px] font-semibold text-[#A09A91] uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3EF]">
              {offerings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[13px] text-[#A09A91]">No services found. Add service offerings above.</td>
                </tr>
              ) : offerings.map(s => {
                const cat = categories.find(c => c.id === s.categoryId);
                return (
                  <tr key={s.id} className="hover:bg-[#FAFAF8] transition-colors group">
                    <td className="px-5 py-4 font-mono text-[10px] text-[#A09A91]">{s.id}</td>
                    <td className="px-5 py-4 font-semibold text-[#1C1C1A] text-[13px] max-w-[180px]">{s.name}</td>
                    <td className="px-5 py-4 text-[11px] text-[#A09A91] max-w-[200px] truncate">{s.description}</td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-medium text-[#6B6560] bg-[#F2F0EC] px-2 py-0.5 rounded-full">
                        {cat?.image || cat?.icon || '✨'} {cat?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[12px] text-[#6B6560]">{s.duration} min</td>
                    <td className="px-5 py-4 font-semibold text-[#1C1C1A]">₹{s.price.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => handleOpenEditService(s)}
                        className="text-[11px] font-semibold text-[#C9A96E] hover:underline">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Service Offering Modal */}
      {showEditService && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-display text-[1.4rem] font-light mb-4">Edit Catalog Service</h3>
            <form onSubmit={handleEditServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Service Name</label>
                <input required value={editServiceForm.name} onChange={e => setEditServiceForm({ ...editServiceForm, name: e.target.value })}
                  placeholder="e.g. Signature Blowdry"
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Description</label>
                <textarea required value={editServiceForm.description} onChange={e => setEditServiceForm({ ...editServiceForm, description: e.target.value })}
                  placeholder="Service description details..."
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E] resize-none" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Price (₹)</label>
                  <input required type="number" value={editServiceForm.price} onChange={e => setEditServiceForm({ ...editServiceForm, price: e.target.value })}
                    placeholder="900"
                    className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Duration (min)</label>
                  <input required type="number" value={editServiceForm.duration} onChange={e => setEditServiceForm({ ...editServiceForm, duration: e.target.value })}
                    placeholder="60"
                    className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#A09A91] uppercase tracking-wider mb-1.5">Category</label>
                <select value={editServiceForm.categoryId} onChange={e => setEditServiceForm({ ...editServiceForm, categoryId: e.target.value })}
                  className="w-full bg-[#FAFAF8] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-[13px] text-[#1C1C1A] focus:outline-none focus:border-[#C9A96E]">
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.image || c.icon || '✨'} {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowEditService(false)}
                  className="flex-1 border border-[#E8E6E1] text-[#6B6560] py-2.5 rounded-xl font-semibold text-[13px]">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-[#1C1C1A] text-white py-2.5 rounded-xl font-semibold text-[13px] hover:bg-[#C9A96E]">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


