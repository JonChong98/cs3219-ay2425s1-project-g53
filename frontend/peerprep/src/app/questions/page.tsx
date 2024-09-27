
'use client'
import React, { useState, useEffect } from 'react';


interface Question {
  id: number;
  title: string;
  description: string;
  categories: [{ name: string }];
  complexity: string;
}


export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    if (expandedQuestions.has(id)) {
      setExpandedQuestions(prev => new Set([...prev].filter(x => x != id)))
    } else {
      setExpandedQuestions(prev => new Set([...prev, id]))
    }
  }

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => { setQuestions(data) });
  }, []);

  // Render form and questions
  return (
    <div className="container-fluid">
      <div className="row mx-3 mt-5" >
        <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: "90vh" }} >
          <table className="table table-striped mh-100" style={{
            tableLayout:
              "fixed",
          }}>
            <thead className="sticky-top">
              <tr>
                <th className="col-1" scope="col">ID</th>
                <th className="col-4" scope="col">Title</th>
                <th className="col-6" scope="col">Description</th>
                <th className="col-3" scope="col">Category</th>
                <th className="col-2" scope="col">Complexity</th>
                <th className="col-1" scope="col"></th>
              </tr>
            </thead>
            <tbody >
              {questions.map(question => (
                <>
                  <tr>
                    <th scope="row">{question.id}</th>
                    <td>{question.title}</td>
                    <td className="text-truncate">{question.description}</td>
                    <td>{question.categories.map(c => c.name).join(", ")}</td>
                    <td>{question.complexity}</td>
                    <td><button className="btn" onClick={() => toggleExpanded(question.id)}><i className="bi-chevron-down"></i> </button></td>
                  </tr>
                  {expandedQuestions.has(question.id) && (
                    <tr>
                      <td className="p-3 text-wrap" colSpan={3}><p style={{ whiteSpace: "pre-line" }}>{question.description}</p></td>
                      <td className="p-3 text-wrap" colSpan={3}>{question.categories.map(c => c.name).join(", ")}</td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
