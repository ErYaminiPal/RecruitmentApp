package net.marsbytes.app.recruitment.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Jobs.
 */
@Entity
@Table(name = "jobs")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Jobs implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "date_published")
    private LocalDate datePublished;

    @Column(name = "job_start_date")
    private LocalDate jobStartDate;

    @Column(name = "no_of_vacancies")
    private Integer noOfVacancies;

    @OneToMany(mappedBy = "jobs")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "applicant", "jobs" }, allowSetters = true)
    private Set<Application> applications = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "jobs" }, allowSetters = true)
    private JobCategories jobCategories;

    @ManyToOne
    @JsonIgnoreProperties(value = { "jobs" }, allowSetters = true)
    private JobPosition jobPosition;

    @ManyToOne
    @JsonIgnoreProperties(value = { "jobs" }, allowSetters = true)
    private ClientOrganization clientOrganization;

    @ManyToOne
    @JsonIgnoreProperties(value = { "steps", "jobs" }, allowSetters = true)
    private Process process;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Jobs id(Long id) {
        this.id = id;
        return this;
    }

    public String getCode() {
        return this.code;
    }

    public Jobs code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public Jobs name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Jobs description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDatePublished() {
        return this.datePublished;
    }

    public Jobs datePublished(LocalDate datePublished) {
        this.datePublished = datePublished;
        return this;
    }

    public void setDatePublished(LocalDate datePublished) {
        this.datePublished = datePublished;
    }

    public LocalDate getJobStartDate() {
        return this.jobStartDate;
    }

    public Jobs jobStartDate(LocalDate jobStartDate) {
        this.jobStartDate = jobStartDate;
        return this;
    }

    public void setJobStartDate(LocalDate jobStartDate) {
        this.jobStartDate = jobStartDate;
    }

    public Integer getNoOfVacancies() {
        return this.noOfVacancies;
    }

    public Jobs noOfVacancies(Integer noOfVacancies) {
        this.noOfVacancies = noOfVacancies;
        return this;
    }

    public void setNoOfVacancies(Integer noOfVacancies) {
        this.noOfVacancies = noOfVacancies;
    }

    public Set<Application> getApplications() {
        return this.applications;
    }

    public Jobs applications(Set<Application> applications) {
        this.setApplications(applications);
        return this;
    }

    public Jobs addApplication(Application application) {
        this.applications.add(application);
        application.setJobs(this);
        return this;
    }

    public Jobs removeApplication(Application application) {
        this.applications.remove(application);
        application.setJobs(null);
        return this;
    }

    public void setApplications(Set<Application> applications) {
        if (this.applications != null) {
            this.applications.forEach(i -> i.setJobs(null));
        }
        if (applications != null) {
            applications.forEach(i -> i.setJobs(this));
        }
        this.applications = applications;
    }

    public JobCategories getJobCategories() {
        return this.jobCategories;
    }

    public Jobs jobCategories(JobCategories jobCategories) {
        this.setJobCategories(jobCategories);
        return this;
    }

    public void setJobCategories(JobCategories jobCategories) {
        this.jobCategories = jobCategories;
    }

    public JobPosition getJobPosition() {
        return this.jobPosition;
    }

    public Jobs jobPosition(JobPosition jobPosition) {
        this.setJobPosition(jobPosition);
        return this;
    }

    public void setJobPosition(JobPosition jobPosition) {
        this.jobPosition = jobPosition;
    }

    public ClientOrganization getClientOrganization() {
        return this.clientOrganization;
    }

    public Jobs clientOrganization(ClientOrganization clientOrganization) {
        this.setClientOrganization(clientOrganization);
        return this;
    }

    public void setClientOrganization(ClientOrganization clientOrganization) {
        this.clientOrganization = clientOrganization;
    }

    public Process getProcess() {
        return this.process;
    }

    public Jobs process(Process process) {
        this.setProcess(process);
        return this;
    }

    public void setProcess(Process process) {
        this.process = process;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Jobs)) {
            return false;
        }
        return id != null && id.equals(((Jobs) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Jobs{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", datePublished='" + getDatePublished() + "'" +
            ", jobStartDate='" + getJobStartDate() + "'" +
            ", noOfVacancies=" + getNoOfVacancies() +
            "}";
    }
}
