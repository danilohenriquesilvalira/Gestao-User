            <div className="h-full flex flex-col">
              {/* LISTA RESPONSIVA */}
              <div className="flex-1 overflow-auto">
                <div className="p-4">
                  <div className="space-y-3">
                    {paginatedTags.map((tag, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              tag.status === 'active' ? 'bg-green-500' : 
                              tag.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                            }`}></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-mono text-sm font-medium text-gray-900">{tag.name}</span>
                                <span className="text-xs bg-white px-2 py-1 rounded border font-mono">
                                  {tag.type.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                {getCategoryIcon(tag.category)}
                                <span>{tag.category}</span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>{tag.lastUpdate.toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-lg font-bold font-mono ${
                              tag.type === 'bool' ? 
                                (tag.value ? 'text-green-600' : 'text-gray-500') : 
                                'text-blue-600'
                            }`}>
                              {formatValue(tag.value, tag.type)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* PAGINAÇÃO */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mostrando {startIndex + 1}-{Math.min(endIndex, filteredTags.length)} de {filteredTags.length} tags
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => 
                            page === 1 || 
                            page === totalPages || 
                            Math.abs(page - currentPage) <= 1
                          )
                          .map((page, index, array) => (
                            <React.Fragment key={page}>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className="px-2 text-gray-400">…</span>
                              )}
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 text-sm rounded-lg ${
                                  currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          ))
                        }
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próximo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>